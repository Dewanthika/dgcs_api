import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale, SaleDocument } from './schema/sale.schema';
import csvStringify from 'csv-stringify/sync';

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

  // New method to get sales report data with optional date range filter
  async getSalesReport(startDate?: Date, endDate?: Date): Promise<any[]> {
    const match: any = {};
    if (startDate) {
      match.createdAt = { $gte: startDate };
    }
    if (endDate) {
      match.createdAt = match.createdAt || {};
      match.createdAt.$lte = endDate;
    }

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 as 1 | -1 } },
    ];

    const result = await this.saleModel.aggregate(pipeline).exec();

    // Map month number to month name
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    return result.map(item => ({
      month: monthNames[item._id - 1],
      totalRevenue: item.totalRevenue,
      totalOrders: item.totalOrders,
    }));
  }

  // New method to generate CSV string for sales report
  async generateSalesReportCSV(startDate?: Date, endDate?: Date): Promise<string> {
    const reportData = await this.getSalesReport(startDate, endDate);

    const records = reportData.map(item => ({
      Month: item.month,
      'Total Revenue': item.totalRevenue,
      'Total Orders': item.totalOrders,
    }));

    const csv = csvStringify.stringify(records, { header: true });
    return csv;
  }
}
