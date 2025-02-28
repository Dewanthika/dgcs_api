import { IsNotEmpty, IsString } from 'class-validator';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { Types } from 'mongoose';
import { CreateProductDto } from 'src/product/dto/create-product.dto';

export class CreateOrderItemsDto {
  @IsString()
  @IsNotEmpty()
  orderID: CreateOrderDto | Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  productID: CreateProductDto | Types.ObjectId;
}
