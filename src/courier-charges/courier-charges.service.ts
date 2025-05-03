import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourierChargeDto } from './dto/create-courier-charge.dto';
import { UpdateCourierChargeDto } from './dto/update-courier-charge.dto';
import {
  CarrierCost,
  CarrierCostDocument,
} from './schema/courier-charge.schema';

@Injectable()
export class CourierChargesService {
  constructor(
    @InjectModel(CarrierCost.name)
    private carrierCostModel: Model<CarrierCostDocument>,
  ) {}

  async create(
    createCourierChargeDto: CreateCourierChargeDto,
  ): Promise<CarrierCost> {
    const createdCharge = new this.carrierCostModel(createCourierChargeDto);
    return createdCharge.save();
  }

  async findAll(): Promise<CarrierCost[]> {
    return this.carrierCostModel.find().exec();
  }

  async findOne(id: string): Promise<CarrierCost | null> {
    return this.carrierCostModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCourierChargeDto: UpdateCourierChargeDto,
  ): Promise<CarrierCost | null> {
    return this.carrierCostModel
      .findByIdAndUpdate(id, updateCourierChargeDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<CarrierCost | null> {
    return this.carrierCostModel.findByIdAndDelete(id).exec();
  }
}
