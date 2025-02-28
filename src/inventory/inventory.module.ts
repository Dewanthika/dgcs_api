import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryGateway } from './inventory.gateway';

@Module({
  providers: [InventoryGateway, InventoryService],
})
export class InventoryModule {}
