import { Module } from '@nestjs/common';
import { CategoryRepositoryModule } from '../../datalake/category/category-repository.module';
import { CategoriesService } from './categories.service';

@Module({
  imports: [CategoryRepositoryModule],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
