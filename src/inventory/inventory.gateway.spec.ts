import { Test, TestingModule } from '@nestjs/testing';
import { InventoryGateway } from './inventory.gateway';
import { InventoryService } from './inventory.service';

describe('InventoryGateway', () => {
  let gateway: InventoryGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryGateway, InventoryService],
    }).compile();

    gateway = module.get<InventoryGateway>(InventoryGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
