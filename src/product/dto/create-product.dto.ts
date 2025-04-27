/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsDecimal,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsOptional()
  productDescription?: string;

  @IsNumber()
  price?: number;

  @IsNumber()
  stock?: number;

  @IsDecimal()
  weight?: number;

  @IsMongoId()
  @IsOptional()
  categoryID: Types.ObjectId;

  @IsString()
  @IsOptional()
  imageURL?: string;

  @IsOptional()
  isHot?: boolean;
}
