import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schema/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  // Create a new category
  async create(createCategoryDto: CreateCategoryDto) {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return await createdCategory.save();
  }

  // Retrieve all categories
  async findAll() {
    return await this.categoryModel.find().exec();
  }

  // Retrieve a single category by ID
  async findOne(id: string) {
    return await this.categoryModel.findById(id).exec();
  }

  // Update an existing category
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, {
        new: true,
      })
      .exec();
  }

  // Remove a category
  async remove(id: string) {
    return await this.categoryModel.findByIdAndDelete(id).exec();
  }
}
