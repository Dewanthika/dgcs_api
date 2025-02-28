import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type CompanyDocument = Company & Document;
@Schema({ timestamps: true })
export class Company extends Document {
  @Prop({ required: true }) CMPName: string;
  @Prop() CMPPhone: string;
  @Prop() CMPAddress: string;
  @Prop() BizRegNo: string;
  @Prop() creditLimit: number;
  @Prop() paymentTerms: string;
}
export const CompanySchema = SchemaFactory.createForClass(Company);
