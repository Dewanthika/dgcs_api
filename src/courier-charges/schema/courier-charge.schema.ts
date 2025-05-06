import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type CarrierCostDocument = CarrierCost & Document;
@Schema({ timestamps: true })
export class CarrierCost extends Document {
  @Prop({ required: true }) serviceCompany: string;
  @Prop() firstKGCost: number;
  @Prop() extraKGCost: number;
  @Prop({ default: 'Active', enum: ['Active', 'Inactive'] })
  status: string;

}
export const CarrierCostSchema = SchemaFactory.createForClass(CarrierCost);
