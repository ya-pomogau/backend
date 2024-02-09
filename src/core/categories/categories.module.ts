import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryRepositoryModule } from 'src/datalake/category/category-repository.module';

@Module({
  imports: [CategoryRepositoryModule],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
