/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Types } from 'mongoose';
export class CreateOrderDto {
  @IsString() @IsNotEmpty() userID: CreateUserDto | Types.ObjectId;

  @IsString() @IsOptional() deliveryAddress?: string;
  @IsOptional() orderWeight?: number;
  @IsOptional() deliveryCharge?: number;
  @IsOptional() orderType?: string;
  @IsOptional() orderStatus?: string;
  @IsDate() @IsOptional() orderDate?: Date;
  @IsOptional() totalAmount?: number;
  @IsOptional() paymentMethod?: string;
}
