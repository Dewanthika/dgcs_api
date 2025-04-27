import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/product/schema/product.schema';
import { User } from 'src/user/schema/user.schema';
export type OrderDocument = Order & Document;

@Schema({ timestamps: false, id: false })
export class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  zip: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ timestamps: false, _id: false })
class OrderItem {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  product: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  userID: Types.ObjectId;

  @Prop({ required: true, type: AddressSchema })
  deliveryAddress: Address;

  @Prop()
  orderWeight: number;

  @Prop()
  deliveryCharge: number;

  @Prop()
  orderType: string;

  @Prop()
  orderStatus: string;

  @Prop()
  orderDate: Date;

  @Prop()
  totalAmount: number;

  @Prop()
  paymentMethod: string;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop()
  isBulkOrder?: boolean;

  @Prop()
  isCredit?: boolean;

  @Prop()
  isApproved?: boolean;

  @Prop()
  trackingLink?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
