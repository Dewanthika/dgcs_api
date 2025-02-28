import { PartialType } from '@nestjs/swagger';
import { CreateCourierChargeDto } from './create-courier-charge.dto';

export class UpdateCourierChargeDto extends PartialType(CreateCourierChargeDto) {}
