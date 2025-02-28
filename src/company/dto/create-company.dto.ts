/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateCompanyDto {
  @IsString() @IsNotEmpty() CMPName: string;
  @IsString() @IsNotEmpty() CMPPhone?: string;
  @IsString() @IsNotEmpty() CMPAddress?: string;
  @IsString() @IsNotEmpty() BizRegNo?: string;
  @IsNumber() @IsNotEmpty() creditLimit?: number;
  @IsString() @IsNotEmpty() paymentTerms?: string;
}
