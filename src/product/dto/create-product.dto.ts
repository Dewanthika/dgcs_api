/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { Types } from 'mongoose';

export class CreateProductDto {
  @IsString() @IsNotEmpty() productID: string;
  @IsString() @IsNotEmpty() productName: string;
  @IsString() @IsOptional() productDescription?: string;
  @IsOptional() price?: number;
  @IsString() @IsOptional() categoryID: CreateCategoryDto | Types.ObjectId;
  @IsString() @IsOptional() imageURL?: string;
}
