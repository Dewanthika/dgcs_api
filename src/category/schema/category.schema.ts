import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type CategoryDocument = Category & Document;
@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true })
  name: string;
  
  @Prop()
  status: string;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
