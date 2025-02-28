import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@WebSocketGateway()
export class InventoryGateway {
  constructor(private readonly inventoryService: InventoryService) {}

  @SubscribeMessage('createInventory')
  create(@MessageBody() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @SubscribeMessage('findAllInventory')
  findAll() {
    return this.inventoryService.findAll();
  }

  @SubscribeMessage('findOneInventory')
  findOne(@MessageBody() id: number) {
    return this.inventoryService.findOne(id);
  }

  @SubscribeMessage('updateInventory')
  update(@MessageBody() updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryService.update(updateInventoryDto.id, updateInventoryDto);
  }

  @SubscribeMessage('removeInventory')
  remove(@MessageBody() id: number) {
    return this.inventoryService.remove(id);
  }
}
