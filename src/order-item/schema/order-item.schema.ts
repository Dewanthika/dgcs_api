import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { Order } from 'src/order/schema/order.schema';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { Product } from 'src/product/schema/product.schema';
export type OrderItemsDocument = OrderItems & Document;
@Schema({ timestamps: true })
export class OrderItems extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: Order.name })
  orderID: CreateOrderDto | Types.ObjectId;
  @Prop({ required: true, type: Types.ObjectId, ref: Product.name }) productID:
    | CreateProductDto
    | Types.ObjectId;
}
export const OrderItemsSchema = SchemaFactory.createForClass(OrderItems);
