import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import exeptions from '../common/constants/exceptions';
import queryRunner from '../common/helpers/queryRunner';
import { Task } from '../tasks/entities/task.entity';
import { TaskStatus } from '../tasks/types';
import checkValidId from '../common/helpers/checkValidId';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly dataSource: DataSource
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = await this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findById(id: string): Promise<Category> {
    checkValidId(id);
    const objectId = new ObjectId(id);
    const category = await this.categoryRepository.findOneBy({ _id: objectId });

    if (!category) {
      throw new NotFoundException(exeptions.categories.notFound);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    checkValidId(id);
    const objectId = new ObjectId(id);

    const category = await this.categoryRepository.findOneBy({ _id: objectId });

    if (!category) {
      throw new NotFoundException(exeptions.categories.notFound);
    }

    if (updateCategoryDto.points) {
      await queryRunner(this.dataSource, [
        this.categoryRepository.update({ _id: objectId }, updateCategoryDto),
        this.taskRepository.update(
          { categoryId: id, status: Not(TaskStatus.CLOSED) },
          { points: updateCategoryDto.points }
        ),
      ]);
    } else {
      await this.categoryRepository.update({ _id: objectId }, updateCategoryDto);
    }

    if (updateCategoryDto.accessStatus) {
      await queryRunner(this.dataSource, [
        this.categoryRepository.update({ _id: objectId }, updateCategoryDto),
        this.taskRepository.update(
          { categoryId: id, status: Not(TaskStatus.CLOSED) },
          { points: updateCategoryDto.accessStatus }
        ),
      ]);
    } else {
      await this.categoryRepository.update({ _id: objectId }, updateCategoryDto);
    }

    return this.categoryRepository.findOneBy({ _id: objectId });
  }
}
