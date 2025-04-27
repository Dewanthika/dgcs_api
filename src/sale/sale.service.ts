import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale, SaleDocument } from './schema/sale.schema';

@Injectable()
export class SaleService {
  constructor(@InjectModel(Sale.name) private saleModel: Model<SaleDocument>) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const sale = new this.saleModel({
      ...createSaleDto,
      createdAt: new Date(),
    });
    await sale.save();
    return sale.toObject();
  }

  async findAll(): Promise<Sale[]> {
    return this.saleModel.find().exec();
  }

  async findOne(id: string): Promise<Sale | null> {
    return this.saleModel.findById(id).exec();
  }

  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale | null> {
    return this.saleModel.findByIdAndUpdate(id, updateSaleDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Sale | null> {
    return this.saleModel.findByIdAndDelete(id).exec();
  }
}
