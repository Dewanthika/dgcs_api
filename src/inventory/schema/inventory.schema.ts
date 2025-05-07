import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { Product } from 'src/product/schema/product.schema';
export type InventoryDocument = Inventory & Document;
@Schema({ timestamps: true })
export class Inventory extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: Product.name })
  productID: Types.ObjectId;
  @Prop() totalQty: number;
  @Prop() damagedQty: number;
  @Prop() updatedAt: Date;
}
export const InventorySchema = SchemaFactory.createForClass(Inventory);
