import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zip: string;
}

export class OrderItemDto {
  @IsMongoId()
  product: Types.ObjectId;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  userID: Types.ObjectId;

  @ValidateNested()
  @Type(() => AddressDto)
  deliveryAddress?: AddressDto;

  @IsOptional()
  orderWeight?: number;

  @IsOptional()
  deliveryCharge?: number;

  @IsOptional()
  orderType?: string;

  @IsOptional()
  orderStatus?: string;

  @IsDate()
  @IsOptional()
  orderDate?: Date;

  @IsOptional()
  totalAmount?: number;

  @IsOptional()
  paymentMethod?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsBoolean()
  isBulkOrder?: boolean;

  @IsOptional()
  @IsBoolean()
  isCredit?: boolean;

  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}
