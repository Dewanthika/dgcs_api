import { Body, Controller, Post, Get, Param, Req } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { OrderItemDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { Request } from 'express';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('payment-intent')
  @Public()
  async createPaymentIntent(@Body('items') items: OrderItemDto[]) {
    return this.orderService.createPaymentIntent(items);
  }

  @Get('total-last-30-days')
  async getTotalOrdersLast30Days() {
    const totalOrders = await this.orderService.getTotalOrdersLast30Days();
    return { totalOrders };
  }

  @Get('revenue-last-30-days')
  async getTotalRevenueLast30Days() {
    const totalRevenue = await this.orderService.getTotalRevenueLast30Days();
    return { totalRevenue };
  }

  @Get('recent')
  async getRecentOrders() {
    const recentOrders = await this.orderService.getRecentOrders();
    return recentOrders;
  }

  @Post('checkout-session')
  @Public()
  async createCheckoutSession(
    @Body('items') items: OrderItemDto[],
    @Body('customerEmail') customerEmail: string,
    @Body('formData') formData: any,
  ) {
    return this.orderService.createCheckoutSession(
      items,
      customerEmail,
      formData,
    );
  }

  @Post('webhook')
  @Public()
  async handleStripeWebhook(@Body() event: any) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.orderService.handlePaymentIntentSucceeded(event);
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }
  }

  @Get('user/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    return this.orderService.findByUserId(userId);
  }

  @Get('total/:userId')
  async getTotalOrdersByUserId(@Param('userId') userId: string) {
    const totalOrders = await this.orderService.getTotalOrdersByUserId(userId);
    return { totalOrders };
  }

  @Get('revenue/:userId')
  async getTotalRevenueByUserId(@Param('userId') userId: string) {
    const totalRevenue = await this.orderService.getTotalRevenueByUserId(userId);
    return { totalRevenue };
  }

  @Get(':id')
  async getOrderDetails(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  // Add this to your OrderController
  @Get('session/:sessionId')
  @Public()
  async getOrderBySessionId(@Param('sessionId') sessionId: string) {
    return this.orderService.findBySessionId(sessionId);
  }

  @Get(':id/edit')
  @Public()
  async getOrderForEdit(@Param('id') id: string) {
    return this.orderService.findOneForEdit(id);
  }
}
