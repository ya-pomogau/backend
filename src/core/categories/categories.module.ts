import { Module } from '@nestjs/common';
import { CategoryRepositoryModule } from '../../datalake/category/category-repository.module';
import { CategoriesService } from './categories.service';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [CategoryRepositoryModule, TasksModule],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
