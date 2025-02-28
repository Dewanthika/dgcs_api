/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsEmpty } from 'class-validator';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { Types } from 'mongoose';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
export class CreateLedgerDto {
  @IsEmpty() @IsNotEmpty() companyID: CreateCompanyDto | Types.ObjectId;
  @IsEmpty() @IsNotEmpty() userID: CreateUserDto | Types.ObjectId;
  @IsEmpty() @IsNotEmpty() transactionType?: string;
  @IsEmpty() @IsNotEmpty() transactionDate?: Date;
  @IsEmpty() @IsNotEmpty() description?: string;
  @IsEmpty() @IsNotEmpty() amount?: number;
}
