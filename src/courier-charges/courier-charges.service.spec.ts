import { Test, TestingModule } from '@nestjs/testing';
import { CourierChargesService } from './courier-charges.service';

describe('CourierChargesService', () => {
  let service: CourierChargesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourierChargesService],
    }).compile();

    service = module.get<CourierChargesService>(CourierChargesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
