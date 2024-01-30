import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../../datalake/category/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../../common/dto/category.dto';
import {
  AdminPermission,
  AnyUserInterface,
  UserRole,
  UserStatus,
} from '../../common/types/user.types';
import { POJOType } from '../../common/types/pojo.type';
import { Volunteer } from '../../datalake/users/schemas/volunteer.schema';
import { Recipient } from '../../datalake/users/schemas/recipient.schema';
import { HashService } from '../../common/hash/hash.service';
import { Admin } from '../../datalake/users/schemas/admin.schema';
import { MongooseIdAndTimestampsInterface } from '../../common/types/system.types';
import exceptions from 'src/common/constants/exceptions';

const options = {select: "_id title points accessLevel"};

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoryRepository) {}

  async getCategories() {
    return this.categoriesRepo.find({});
  }

  //TODO вынести общую часть про castError отдельно
  async getCategoryById(id: string) {
    let category;
    try {
      category = await this.categoriesRepo.findOne({_id: id});
    } catch (err) {
      throw new InternalServerErrorException(exceptions.category.castError)
    }

    if (!category) {
      throw new NotFoundException(exceptions.category.notFound);
    }

    return category;
  }

  // Только root
  async removeCategory(id: string, user: AnyUserInterface) {
    let res;
    if (user.role !== UserRole.ADMIN || (user.role === UserRole.ADMIN && !user.isRoot)) {
      throw new ForbiddenException(exceptions.category.notEnoughRights);
    }

    try {
      res = await this.categoriesRepo.deleteOne({_id: id}, {});
    } catch (err) {
      throw new InternalServerErrorException(exceptions.category.castError)
    }
    if (!res.deletedCount) {
      throw new InternalServerErrorException(exceptions.category.nothingToDelete);
    }
    return res;
  }

  // Только админы с правами AdminPermission.CATEGORIES
  async updateCategoryById(id: string, updateData: UpdateCategoryDto, user: AnyUserInterface) {
    let res;

    if (
      user.role !== UserRole.ADMIN
      || (user.role === UserRole.ADMIN && user.permissions.includes(AdminPermission.CATEGORIES))
    ) {
      throw new ForbiddenException(exceptions.category.notEnoughRights);
    }

    try {
      res = await this.categoriesRepo.findOneAndUpdate({_id: id}, updateData, options)
    } catch (err) {
      throw new InternalServerErrorException(exceptions.category.castError)
    }
    if (!res) {
      throw new NotFoundException(exceptions.category.notFound)
    }

    return res;
  }

  // Только root
  async createCategory(data: CreateCategoryDto, user: AnyUserInterface) {
    if (user.role !== UserRole.ADMIN || (user.role === UserRole.ADMIN && !user.isRoot)) {
      throw new ForbiddenException(exceptions.category.notEnoughRights);
    }
    return this.categoriesRepo.create(data);
  }

  // TODO как лучше апдейтить балком?
  async updateCategories(data: Record<string, number>[], user: AnyUserInterface) {
    if (
      user.role !== UserRole.ADMIN
      || (user.role === UserRole.ADMIN && user.permissions.includes(AdminPermission.CATEGORIES))
    ) {
      throw new ForbiddenException(exceptions.category.notEnoughRights);
    }





    return {};
  }

}
