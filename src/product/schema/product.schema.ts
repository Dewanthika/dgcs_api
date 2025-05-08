import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { Category } from 'src/category/schema/category.schema';
export type ProductDocument = Product & Document;
@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  productName: string;

  @Prop()
  productDescription: string;

  @Prop()
  price: number;

  @Prop()
  weight: number;

  @Prop({ type: Types.ObjectId, required: true, ref: Category.name })
  categoryID: Types.ObjectId;

  @Prop()
  stock: number;

  @Prop()
  reorderLevel: number;

  @Prop({ default: 5 })
  minThreshold: number;

  @Prop()
  imageURL: string;

  @Prop({ default: false })
  isHot: boolean;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
