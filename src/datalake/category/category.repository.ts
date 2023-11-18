import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';

import { BaseRepositoryService } from '../base-repository/base-repository.service';

@Injectable()
export class CategoryRepository extends BaseRepositoryService<Category> {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) {
    super(categoryModel);
  }
}
