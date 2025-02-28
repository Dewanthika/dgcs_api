import { Module } from '@nestjs/common';
import { CourierChargesService } from './courier-charges.service';
import { CourierChargesController } from './courier-charges.controller';

@Module({
  controllers: [CourierChargesController],
  providers: [CourierChargesService],
})
export class CourierChargesModule {}
