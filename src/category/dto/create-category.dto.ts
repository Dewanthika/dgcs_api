/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateCategoryDto {
  @IsString() @IsNotEmpty() category: string;
  @IsString() @IsNotEmpty() status?: string;
}
