import { PartialType } from '@nestjs/swagger';
import { CreateOrderItemsDto } from './create-order-item.dto';

export class UpdateOrderItemDto extends PartialType(CreateOrderItemsDto) {}
