/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateCourierChargeDto {
  @IsString() @IsNotEmpty() serviceCompany: string;
  @IsNumber() @IsNotEmpty() firstKGCost?: number;
  @IsNumber() @IsNotEmpty() extraKGCost?: number;
  @IsOptional() @IsString() @IsIn(['Active', 'Inactive']) status?: 'Active' | 'Inactive';
}
