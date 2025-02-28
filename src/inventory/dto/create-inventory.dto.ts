/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { Types } from 'mongoose';

export class CreateInventoryDto {
  @IsString() @IsNotEmpty() productID: CreateProductDto | Types.ObjectId;
  @IsNumber() @IsNumber() totalQty?: number;
  @IsNumber() @IsNumber() damagedQty?: number;
  @IsDate() updatedAt?: Date;
}
