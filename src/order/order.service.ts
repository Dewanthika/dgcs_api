import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import { Model, Types } from 'mongoose';
import OrderStatusEnum from 'src/constant/orderStatus.enum';
import { SaleService } from 'src/sale/sale.service';
import { User, UserDocument } from 'src/user/schema/user.schema';
import Stripe from 'stripe';
import { sendEmail } from '../utils/nodemailer.util'; // Import sendEmail function
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schema/order.schema';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderService {
  public stripe: Stripe;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private customerModel: Model<UserDocument>,
    private configService: ConfigService,
    private saleService: SaleService,
    private productService: ProductService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') || '',
      {
        apiVersion: '2025-03-31.basil',
      },
    );
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return await this.orderModel
      .find({ userID: new Types.ObjectId(userId) })
      .populate('userID items.product')
      .exec();
  }

  async getTotalOrdersLast30Days(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return await this.orderModel.countDocuments({
      orderDate: { $gte: thirtyDaysAgo },
    });
  }

  async getTotalOrdersByUserId(userId: string): Promise<number> {
    return await this.orderModel.countDocuments({
      userID: new Types.ObjectId(userId),
    });
  }

  async getTotalRevenueByUserId(userId: string): Promise<number> {
    const result = await this.orderModel.aggregate([
      {
        $match: {
          userID: new Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    return result.length > 0 ? result[0].totalRevenue : 0;
  }

  async getTotalRevenueLast30Days(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await this.orderModel.aggregate([
      {
        $match: {
          orderDate: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    return result.length > 0 ? result[0].totalRevenue : 0;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const order = new this.orderModel({
        ...createOrderDto,
      });

      await order.save();

      return order.toObject();
    } catch (err) {
      console.error('[OrderService] Failed to create order:', err);
      throw new WsException(err?.message || 'Order creation failed');
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find();
  }

  async getRecentOrders(limit = 10): Promise<Order[]> {
    return await this.orderModel
      .find()
      .sort({ orderDate: -1 })
      .limit(limit)
      .populate('userID')
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('userID outlet items.product');
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updated = await this.orderModel.findByIdAndUpdate(
      id,
      updateOrderDto,
      { new: true },
    );
    if (!updated) throw new NotFoundException('Order not found');

    // Send email notification on status update
    if (updateOrderDto.orderStatus) {
      const order = await this.findOne(id);

      // Save sales when order status changes to COMPLETE
      if (updateOrderDto.orderStatus === OrderStatusEnum.COMPLETE) {
        // Transform order items to sales items as needed by CreateSaleDto
        const salesItems = order.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          store: (order as any).outlet?._id?.toString() || '', // safely access outlet id as string
          order: (order._id as any).toString(),
        }));

        // Create sale entries for each item
        for (const saleItem of salesItems) {
          await this.saleService.create({
            product: saleItem.product.toString(),
            quantity: saleItem.quantity,
            store: saleItem.store,
            order: saleItem.order,
            saleDate: new Date().toISOString(),
            totalAmount: order.totalAmount,
            userId: order.userID.toString(),
          });
        }
      }

      const emailSubject = `Order Status Update - ${order._id}`;
      const emailText = `
        Your order with ID ${order._id} status has been updated to: ${updateOrderDto.orderStatus}.
        You can track your order using the following link: ${order.trackingLink || 'N/A'}
      `;
      // Fetch user email from user service or populate userID
      const user = await this.customerModel.findById(order.userID);
      const userEmail = user?.email || 'no-reply@example.com';
      await sendEmail(userEmail, emailSubject, emailText);
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.orderModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Order not found');
  }

  async createPaymentIntent(items: OrderItemDto[]) {
    const amount = items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0,
    );
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'lkr',
      payment_method_types: ['card'],
    });

    if (!paymentIntent || paymentIntent.status !== 'requires_payment_method') {
      throw new Error('Failed to create payment intent');
    }

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async createCheckoutSession(
    items: OrderItemDto[],
    customerEmail: string,
    formData: any,
  ) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
        price_data: {
          currency: 'lkr',
            unit_amount: formData.totalAmount * 100,
          product_data: {
              name: 'Order Total',
              description: `Includes products, ${formData.discount}% discount, and delivery charge ${formData.deliveryCharge}.`,
            },
          },
        },
      ],
      customer_email: customerEmail,
      // Change Here for payment success and cancel URLs
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      payment_intent_data: {
        metadata: {
          items: JSON.stringify(
            items.map((i) => ({
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              product:
                typeof i.product === 'string' ? i.product : String(i.product),
              productName: i.productName,
            })),
          ),
          data: JSON.stringify(formData),
        },
      },
    });

    return { url: session.url };
  }

  async handlePaymentIntentSucceeded(event: any): Promise<void> {
    const intentId = event.data.object.id;

    // Always fetch full PaymentIntent to access metadata
    const paymentIntent = await this.stripe.paymentIntents.retrieve(intentId);
    const metadata = paymentIntent.metadata;

    if (!metadata?.data || !metadata?.items) {
      throw new WsException('Missing metadata in payment intent');
    }

    let formData: any;
    let items: OrderItemDto[];

    try {
      formData = JSON.parse(metadata.data);
      items = JSON.parse(metadata.items);
    } catch (err) {
      throw new WsException('Invalid JSON in metadata');
    }

    // Validate required delivery address fields
    const requiredFields = ['street', 'city', 'state', 'zip'];
    for (const field of requiredFields) {
      if (!formData.deliveryAddress[field]) {
        throw new WsException(`Missing required delivery field: ${field}`);
      }
    }

    const user = await this.customerModel.findOne({ email: formData.email });
    if (!user) {
      throw new WsException(`User not found for email: ${formData.email}`);
    }

    const orderItems = items.map((item: OrderItemDto) => ({
      product: item.product,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      productName: item.productName,
    }));

    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0,
    );

    let order;
    try {
      order = new this.orderModel({
        userID: user?._id as Types.ObjectId,
        items: orderItems,
        totalAmount: formData.totalAmount,
        deliveryAddress: {
          street: formData.deliveryAddress.street,
          city: formData.deliveryAddress.city,
          state: formData.deliveryAddress.state,
          zip: formData.deliveryAddress.zip,
        },
        orderWeight: formData?.orderWeight || 0,
        isBulkOrder: formData.isBulkOrder,
        isCredit: formData.isCredit,
        isApproved: false,
        orderDate: new Date(),
        orderType: 'delivery',
        orderStatus: OrderStatusEnum.COMPLETE,
        paymentStatus: 'complete',
        deliveryCharge: formData.deliveryCharge || 0,
        discount: formData.discount || 0,
        paymentMethod: 'stripe',
        paymentIntentId: paymentIntent.id,
      });

      await order.save();

    } catch (error) {
      console.error('Error creating order:', error);
      throw new WsException('Failed to create order');
    }

    // Deduct stock from products
    for (const item of orderItems) {
      const product = await this.productService.findOne(
        item.product.toString(),
      );
      if (!product) {
        throw new WsException(`Product not found: ${item.product}`);
      }
      if (product.stock < item.quantity) {
        throw new WsException(
          `Insufficient stock for product ${product.productName}. Available: ${product.stock}, required: ${item.quantity}`,
        );
      }
      const newStock = product.stock - item.quantity;
      await this.productService.update(product?._id!.toString(), {
        stock: newStock,
      });
    }

    const salesItems = order.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      store: (order as any).outlet?._id?.toString() || '',
      order: (order._id as any).toString(),
    }));

    // Create sale entries for each item
    for (const saleItem of salesItems) {
      await this.saleService.create({
        product: saleItem.product.toString(),
        quantity: saleItem.quantity,
        store: saleItem.store,
        order: saleItem.order,
        saleDate: new Date().toISOString(),
        totalAmount: order.totalAmount,
        userId: order.userID.toString(),
      });
    }

    const emailSubject = `Order Confirmation - ${order._id}`;
    const emailText = `
      Thank you for your order!

      🧾 Order ID: ${order._id}
      💰 Total Amount: £${totalAmount.toFixed(2)}

      📦 Items:
      ${items.map((item, i) => `${i + 1}. ${item.product} - £${item.unitPrice} x ${item.quantity}`).join('\n')}

      We'll process your order shortly and send you updates once it's on the way.

      If you have any questions, feel free to reply to this email.

      Best regards,  
      The DGCS Team
      `;

    await sendEmail(formData.email, emailSubject, emailText);
  }

  // Add this to your OrderService
  async findBySessionId(sessionId: string): Promise<Order> {
    // First get the session to find the payment intent ID
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    if (!session.payment_intent) {
      throw new NotFoundException('Payment intent not found in session');
    }

    // Then find order by payment intent ID
    const order = await this.orderModel
      .findOne({
        paymentIntentId: session.payment_intent as string,
      })
      .populate('customer items.product');

    if (!order) {
      throw new NotFoundException('Order not found for this session');
    }

    return order;
  }

  async findOneForEdit(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate([
        {
          path: 'userID',
          model: 'User',
          select: 'fName lName email phone address city district postal_code',
        },
        {
          path: 'items.product',
          model: 'Product',
          select: 'title price stock',
        },
      ])
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
