import { IsString, IsOptional, IsEmail, IsDate, IsMongoId, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import UserRole from 'constant/UserRole.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  fName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lName: string;

  @ApiProperty({ example: '1990-05-15', required: false })
  @IsOptional()
  @IsString()
  DOB?: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'securepassword123' })
  @IsString()
  password: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Brooklyn' })
  @IsString()
  district: string;

  @ApiProperty({ example: '11201' })
  @IsString()
  postal_code: string;

  @ApiProperty({ example: 'Tech Solutions Ltd.', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ example: 'BR1234567', required: false })
  @IsOptional()
  @IsString()
  businessRegNo?: string;

  @ApiProperty({ example: 'uploads/business_reg_image.jpg', required: false })
  @IsOptional()
  @IsString()
  businessRegImage?: string;  // File path or URL

  @ApiProperty()
  @IsString()
  userType: string;

  @ApiProperty({ example: '605c72d9f1e4c82f78e92b31', required: false })
  @IsOptional()
  @IsMongoId()
  companyID?: Types.ObjectId;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status: string;
}
