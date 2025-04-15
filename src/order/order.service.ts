import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schema/order.schema';

@Injectable()
export class OrderService {
  public stripe: Stripe;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    // @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
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
    console.log({formData, customerEmail, items})
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
    console.log({intentId, paymentIntent})
    const metadata = paymentIntent.metadata;

    if (!metadata?.data || !metadata?.items) {
      throw new WsException('Missing metadata in payment intent');
    }

    const formData = JSON.parse(metadata.data);
    const items = JSON.parse(metadata.items);

    // console.log({ formData, items });

    // await this.create({
    //   userID: Types.ObjectId,
    //   deliveryAddress: Address,
    //   orderWeight: number,
    //   deliveryCharge: number,
    //   orderType: string,
    //   orderStatus: string,
    //   orderDate: new Date(),
    //   totalAmount: number,
    //   paymentMethod: "instore",
    //   isBulkOrder: false,
    //   isCredit: false,
    //   isApproved: false,
    //   items
    // });
  }
}
