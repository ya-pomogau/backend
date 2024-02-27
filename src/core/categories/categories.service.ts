import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import exceptions from '../../common/constants/exceptions';
import { CategoryRepository } from '../../datalake/category/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../../common/dto/category.dto';
import { AdminPermission, UserRole, AdminInterface } from '../../common/types/user.types';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoryRepository) {}

  async getCategories() {
    return this.categoriesRepo.find({});
  }

  // TODO вынести общую часть про castError отдельно
  async getCategoryById(id: string) {
    let category;

    try {
      category = await this.categoriesRepo.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(exceptions.category.internalError, {
        cause: `Ошибка в методе поиска категории findById: ${err}`,
      });
    }

    if (!category) {
      throw new NotFoundException(exceptions.category.notFound);
    }

    return category;
  }

  // Только root
  async removeCategory(id: string, user: AdminInterface) {
    let res;
    if (user.role !== UserRole.ADMIN || (user.role === UserRole.ADMIN && !user.isRoot)) {
      throw new ForbiddenException(exceptions.category.notEnoughRights);
    }

    try {
      res = await this.categoriesRepo.deleteOne({ _id: id }, {});
    } catch (err) {
      throw new InternalServerErrorException(exceptions.category.internalError, {
        cause: `Ошибка в методе удаления категории deleteOne: ${err}`,
      });
    }

    if (!res.deletedCount) {
      throw new InternalServerErrorException(exceptions.category.nothingToDelete);
    }
    return res;
  }

  // Только админы с правами AdminPermission.CATEGORIES
  async updateCategoryById(id: string, updateData: UpdateCategoryDto, user: AdminInterface) {
    let res;

    if (
      user.role !== UserRole.ADMIN ||
      (user.role === UserRole.ADMIN && !user.permissions.includes(AdminPermission.CATEGORIES))
    ) {
      throw new ForbiddenException(exceptions.category.notEnoughRights);
    }

    try {
      res = await this.categoriesRepo.findOneAndUpdate({ _id: id }, updateData, {});
    } catch (err) {
      throw new InternalServerErrorException(exceptions.category.internalError, {
        cause: `Ошибка в методе обновления данных категории findOneAndUpdate: ${err}`,
      });
    }

    if (!res) {
      throw new NotFoundException(exceptions.category.notFound);
    }

    return res;
  }

  // Только root
  async createCategory(data: CreateCategoryDto, user: AdminInterface) {
    if (user.role !== UserRole.ADMIN || (user.role === UserRole.ADMIN && !user.isRoot)) {
      throw new ForbiddenException(exceptions.category.notEnoughRights);
    }

    return this.categoriesRepo.create(data);
  }

  // Только для админов с правами AdminPermission.CATEGORIES
  async updatePoints(data: Record<string, number>, user: AdminInterface) {
    if (!(user.role === UserRole.ADMIN && user.permissions.includes(AdminPermission.CATEGORIES))) {
      throw new ForbiddenException(exceptions.category.notEnoughRights);
    }

    const res = await Promise.allSettled(
      Object.keys(data).map(
        (id) => this.categoriesRepo.findByIdAndUpdate(id, { points: data[id] }, {}),
        this
      )
    ).catch((err) => {
      throw new InternalServerErrorException(err.message);
    });

    return res;
  }
}
