import { IsMongoId, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateSaleDto {
  @IsMongoId()
  @IsNotEmpty()
  product: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsDateString()
  @IsNotEmpty()
  saleDate: string;

  @IsMongoId()
  @IsNotEmpty()
  store: string;

  @IsMongoId()
  @IsNotEmpty()
  order: string;
}
