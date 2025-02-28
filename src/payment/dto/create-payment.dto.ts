/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Types } from 'mongoose';

import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderID: CreateOrderDto | Types.ObjectId;
  @IsString()
  @IsNotEmpty()
  paymentType?: string;
  @IsDate()
  @IsNotEmpty()
  paymentDate?: Date;
  @IsString()
  @IsNotEmpty()
  paymentStatus?: string;
  @IsNumber()
  @IsNotEmpty()
  amount?: number;
}
