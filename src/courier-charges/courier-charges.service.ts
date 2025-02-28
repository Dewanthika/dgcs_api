import { Injectable } from '@nestjs/common';
import { CreateCourierChargeDto } from './dto/create-courier-charge.dto';
import { UpdateCourierChargeDto } from './dto/update-courier-charge.dto';

@Injectable()
export class CourierChargesService {
  create(createCourierChargeDto: CreateCourierChargeDto) {
    return 'This action adds a new courierCharge';
  }

  findAll() {
    return `This action returns all courierCharges`;
  }

  findOne(id: number) {
    return `This action returns a #${id} courierCharge`;
  }

  update(id: number, updateCourierChargeDto: UpdateCourierChargeDto) {
    return `This action updates a #${id} courierCharge`;
  }

  remove(id: number) {
    return `This action removes a #${id} courierCharge`;
  }
}
