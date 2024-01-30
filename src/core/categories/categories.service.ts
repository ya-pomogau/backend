import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../../datalake/category/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../../common/dto/category.dto';
import {
  AdminInterface,
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

  //TODO права??
  async removeCategory(id) {
    let res;
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

  //TODO если не найдена категория
  async updateCategoryById(id, updateData: UpdateCategoryDto) {
    console.log('update', updateData, id)
    return this.categoriesRepo.findOneAndUpdate({_id: id}, updateData, {})
  }









  //TODO кто может создавать категории? Только админ? Любой или только isRoot? administrative: 'CATEGORIES' - это значит, что может менять только поинты?
  //TODO и все-таки, кто же создает?
  async createCategory(data: CreateCategoryDto) {
    //check rights

    // let extras: Partial<CreateUserDto | CreateAdminDto> = {};
    // if (dto.role === UserRole.VOLUNTEER) {
    //   extras = { keys: false, score: 0 };
    // }
    console.log('service create', UserRole.ADMIN);
    return this.categoriesRepo.create(data);
  }


  // TODO как лучше апдейтить балком?
  async updateCategories(query, updateData: UpdateCategoryDto) {
    return this.categoriesRepo.updateMany(query, updateData, {})
  }

}
