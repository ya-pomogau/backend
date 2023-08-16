import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import exeptions from '../common/constants/exeptions';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = await this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findById(id: string): Promise<Category> {
    const objectId = new ObjectId(id);
    const category = await this.categoryRepository.findOneBy({ _id: objectId });

    if (!category) {
      throw new NotFoundException(exeptions.categories.notFound);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const objectId = new ObjectId(id);
    await this.categoryRepository.update({ _id: objectId }, updateCategoryDto);
    return this.categoryRepository.findOneBy({ _id: objectId });
  }
}
