import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type CompanyDocument = Company & Document;
@Schema({ timestamps: true })
export class Company extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop()
  creditLimit: number;

  @Prop()
  discount: number;

  @Prop()
  paymentTerms: string;

  @Prop()
  status: string;
}
export const CompanySchema = SchemaFactory.createForClass(Company);
