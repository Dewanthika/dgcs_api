import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Permissions } from 'constant/permission.enum';

export class CreateUserTypeDto {
  @IsString()
  @IsNotEmpty()
  userTypeID: string;

  @IsString()
  @IsNotEmpty()
  userRole: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Permissions)
  permission?: Permissions[];
}
