/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';
export class CreateCompanyDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  creditLimit?: number;

  @IsNumber()
  @IsNotEmpty()
  discount?: number;

  @IsString()
  @IsNotEmpty()
  paymentTerms?: string;

  @IsString()
  @IsNotEmpty()
  status?: string;
}
