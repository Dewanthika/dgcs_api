import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
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

  @Get('user')
  async getUserOrders(@Req() req: Request) {
    // const userId = req.user['sub'];
    // return this.orderService.findByUserId(userId);
  }

  @Get(':id')
  async getOrderDetails(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
}
