import { Test, TestingModule } from '@nestjs/testing';
import { CourierChargesController } from './courier-charges.controller';
import { CourierChargesService } from './courier-charges.service';

describe('CourierChargesController', () => {
  let controller: CourierChargesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourierChargesController],
      providers: [CourierChargesService],
    }).compile();

    controller = module.get<CourierChargesController>(CourierChargesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
