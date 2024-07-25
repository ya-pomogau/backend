import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ApiBulkUpdateCategoriesDto } from '../../api/admin-api/dto/bulk-update-categories.dto';
import exceptions from '../../common/constants/exceptions';
import { CreateCategoryDto, UpdateCategoryDto } from '../../common/dto/category.dto';
import { AdminPermission, AdminInterface } from '../../common/types/user.types';
import { checkIsEnoughRights } from '../../common/helpers/checkIsEnoughRights';
import { CategoryRepository } from '../../datalake/category/category.repository';

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
    if (!checkIsEnoughRights(user, [], true)) {
      throw new ForbiddenException(exceptions.category.notEnoughRights);
    }

    let res;
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
  async updateCategoriesByIds(dto: ApiBulkUpdateCategoriesDto, user: AdminInterface) {
    if (!checkIsEnoughRights(user, [AdminPermission.CATEGORIES])) {
      throw new ForbiddenException(exceptions.category.notEnoughRights);
    }

    let res;
    const bulkUpdateArr = dto.data.map((item) => {
      const { id, ...data } = item;
      const operation = {
        updateOne: {
          filter: { _id: id },
          update: { ...data },
        },
      };
      return operation;
    });

    try {
      res = await this.categoriesRepo.bulkWrite(bulkUpdateArr, { ordered: false });
    } catch (err) {
      throw new InternalServerErrorException(exceptions.category.internalError, {
        cause: `Ошибка в методе массового обновления категорий updateCategoriesByIds: ${err}`,
      });
    }

    return res;
  }

  // Только админы с правами AdminPermission.CATEGORIES
  async updateCategoryById(id: string, updateData: UpdateCategoryDto, user: AdminInterface) {
    if (!checkIsEnoughRights(user, [AdminPermission.CATEGORIES])) {
      throw new ForbiddenException(exceptions.category.notEnoughRights);
    }

    let res;
    try {
      res = await this.categoriesRepo.findOneAndUpdate({ _id: id }, updateData, { new: true });
    } catch (err) {
      throw new InternalServerErrorException(exceptions.category.internalError, {
        cause: `Ошибка в методе обновления данных категории findOneAndUpdate: ${err}`,
      });
    }
    if (!res) throw new NotFoundException(exceptions.category.notFound);

    return res;
  }

  // Только root
  async createCategory(data: CreateCategoryDto, user: AdminInterface) {
    if (!checkIsEnoughRights(user, [], true)) {
      throw new ForbiddenException(exceptions.category.notEnoughRights);
    }

    return this.categoriesRepo.create(data);
  }

  // Только для админов с правами AdminPermission.CATEGORIES
  async updatePoints(data: Record<string, number>, user: AdminInterface) {
    if (!checkIsEnoughRights(user, [AdminPermission.CATEGORIES])) {
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
