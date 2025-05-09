import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderGateway } from './order.gateway';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { SaleModule } from 'src/sale/sale.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }, { name: User.name, schema: UserSchema },]),
    ConfigModule,
    UserModule,
    SaleModule,
    ProductModule,
  ],
  providers: [OrderGateway, OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
