import { Injectable, NotFoundException } from '@nestjs/common';
import { sendEmail } from '../utils/nodemailer.util'; // Import sendEmail function
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import { Model, ObjectId, Types } from 'mongoose';
import Stripe from 'stripe';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schema/order.schema';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User, UserDocument } from 'src/user/schema/user.schema';

@Injectable()
export class OrderService {
  public stripe: Stripe;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private customerModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') || '',
      {
        apiVersion: '2025-03-31.basil',
      },
    );
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
    return this.orderModel.find().populate('customer outlet items.product');
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('customer outlet items.product');
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
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: item.unitPrice * 100, // Stripe expects amount in cents
          product_data: {
            name:
              typeof item.product === 'string'
                ? item.product
                : String(item.product),
          },
        },
      })),
      customer_email: customerEmail,
      success_url: `${process.env.FRONTEND_URL}/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      payment_intent_data: {
        metadata: {
          items: JSON.stringify(
            items.map((i) => ({
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              product:
                typeof i.product === 'string' ? i.product : String(i.product),
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

    console.log({ formData });

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
    }));

    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0,
    );

    const order = new this.orderModel({
      userID: user?._id as Types.ObjectId,
      items: orderItems,
      totalAmount,
      deliveryAddress: {
        street: formData.deliveryAddress.street,
        city: formData.deliveryAddress.city,
        state: formData.deliveryAddress.state,
        zip: formData.deliveryAddress.zip,
      },
      orderWeight: 1,
      isBulkOrder: formData.isBulkOrder,
      isCredit: formData.isCredit,
      isApproved: false,
      orderDate: new Date(),
      orderType: 'delivery',
      orderStatus: 'pending',
      deliveryCharge: 400,
      paymentMethod: 'stripe',
    });

    await order.save();

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
}
