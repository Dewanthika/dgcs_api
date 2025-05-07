/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';
import { Types } from 'mongoose';

export class CreateInventoryDto {
  @IsString() @IsNotEmpty() productID: Types.ObjectId;
  @IsNumber() @IsNumber() totalQty?: number;
  @IsNumber() @IsNumber() damagedQty?: number;
  @IsDate() updatedAt?: Date;
}
