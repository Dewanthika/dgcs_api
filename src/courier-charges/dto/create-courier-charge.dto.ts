/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CarrierCostDto {
  @IsString() @IsNotEmpty() serviceCompany: string;
  @IsNumber() @IsNotEmpty() firstKGCost?: number;
  @IsNumber() @IsNotEmpty() extraKGCost?: number;
}
