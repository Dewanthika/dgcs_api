import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderGateway } from './order.gateway';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ConfigModule,
  ],
  providers: [OrderGateway, OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
