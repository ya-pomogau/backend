import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.shema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const createdCategory = new this.categoryModel(createCategoryDto);
    const saveCategory = await createdCategory.save();
    return saveCategory.toObject();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().lean().exec();
  }

  async findOne(id: string): Promise<Category | null> {
    const findCategory = await this.categoryModel.findById(id).lean().exec();

    if (!findCategory) {
      return null; // Возвращаем null, если категория с указанным id не найдена
    }

    return findCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category | null> {
    const now = Date.now();
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      updateCategoryDto,
      { new: true }
    );

    if (!updatedCategory) {
      return null; // Возвращаем null, если категория с указанным id не найдена
    }

    return updatedCategory.toObject();
  }

  async remove(id: string): Promise<Category | null> {
    const removeCategory = await this.categoryModel.findByIdAndRemove(id).lean().exec();

    if (!removeCategory) {
      return null; // Возвращаем null, если категория с указанным id не найдена
    }

    return removeCategory;
  }
}
