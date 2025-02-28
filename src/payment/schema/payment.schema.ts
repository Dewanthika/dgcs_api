import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { Order } from 'src/order/schema/order.schema';
export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: Order.name }) orderID:
    | CreateOrderDto
    | Types.ObjectId;
  @Prop() paymentType: string;
  @Prop() paymentDate: Date;
  @Prop() paymentStatus: string;
  @Prop() amount: number;
}
export const PaymentSchema = SchemaFactory.createForClass(Payment);
