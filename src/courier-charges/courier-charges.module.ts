import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourierChargesService } from './courier-charges.service';
import { CourierChargesController } from './courier-charges.controller';
import { CarrierCost, CarrierCostSchema } from './schema/courier-charge.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CarrierCost.name, schema: CarrierCostSchema }])],
  controllers: [CourierChargesController],
  providers: [CourierChargesService],
})
export class CourierChargesModule {}
