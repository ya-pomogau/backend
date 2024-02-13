import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import exceptions from '../../common/constants/exceptions';
import { CategoryRepository } from '../../datalake/category/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../../common/dto/category.dto';
import { AdminPermission, AnyUserInterface, UserRole } from '../../common/types/user.types';

const options = { select: '_id title points accessLevel' };

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
  async removeCategory(id: string, user: AnyUserInterface) {
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
  async updateCategoryById(id: string, updateData: UpdateCategoryDto, user: AnyUserInterface) {
    let res;

    if (
      user.role !== UserRole.ADMIN ||
      (user.role === UserRole.ADMIN && user.permissions.includes(AdminPermission.CATEGORIES))
    ) {
      throw new ForbiddenException(exceptions.category.notEnoughRights);
    }

    try {
      res = await this.categoriesRepo.findOneAndUpdate({ _id: id }, updateData, options);
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
  async createCategory(data: CreateCategoryDto, user: AnyUserInterface) {
    if (user.role !== UserRole.ADMIN || (user.role === UserRole.ADMIN && !user.isRoot)) {
      throw new ForbiddenException(exceptions.category.notEnoughRights);
    }

    return this.categoriesRepo.create(data);
  }

  // Только для админов с правами AdminPermission.CATEGORIES
  async updateCategories(data: Record<string, number>, user: AnyUserInterface) {
    const repo = this.categoriesRepo;
    if (
      user.role !== UserRole.ADMIN ||
      (user.role === UserRole.ADMIN && user.permissions.includes(AdminPermission.CATEGORIES))
    ) {
      throw new ForbiddenException(exceptions.category.notEnoughRights);
    }

    return Promise.all(
      Object.keys(data).map((id) => {
        return repo.findByIdAndUpdate(id, { points: data[id] }, {}).catch((err) => {
          return new InternalServerErrorException(err.message);
        });
      })
    )
      .then((res) => res)
      .catch((err) => {
        throw new InternalServerErrorException(err.message);
      });
  }
}
