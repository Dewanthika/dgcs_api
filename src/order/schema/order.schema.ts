import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/schema/user.schema';
export type OrderDocument = Order & Document;
@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name }) userID:
    | CreateUserDto
    | Types.ObjectId;

  @Prop() deliveryAddress: string;
  @Prop() orderWeight: number;
  @Prop() deliveryCharge: number;
  @Prop() orderType: string;
  @Prop() orderStatus: string;
  @Prop() orderDate: Date;
  @Prop() totalAmount: number;
  @Prop() paymentMethod: string;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
