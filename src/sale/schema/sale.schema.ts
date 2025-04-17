import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/product/schema/product.schema';
import { Order } from 'src/order/schema/order.schema';

export type SaleDocument = HydratedDocument<Sale>;

@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  product: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  saleDate: Date;

  @Prop({ type: Types.ObjectId, ref: Order.name, required: true })
  order: Types.ObjectId;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
