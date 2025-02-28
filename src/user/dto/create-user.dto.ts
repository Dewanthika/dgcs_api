/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { Types } from 'mongoose';
import { CreateUserTypeDto } from 'src/user-type/dto/create-user-type.dto';
export class AddressDto {
  @IsNotEmpty()
  @IsString()
  city: string;
  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string;
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fName: string;

  @IsString()
  @IsNotEmpty()
  lName: string;

  @IsDate()
  @IsOptional()
  DOB?: Date;

  @IsString()
  @IsOptional()
  address?: AddressDto;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  companyID?: CreateCompanyDto | Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  userTypeID: CreateUserTypeDto | Types.ObjectId;
}
