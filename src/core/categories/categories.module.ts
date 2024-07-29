import { Module } from '@nestjs/common';
import { CategoryRepositoryModule } from '../../datalake/category/category-repository.module';
import { CategoriesService } from './categories.service';
import { TasksRepositoryModule } from 'src/datalake/task/tasks-repository.module';

@Module({
  imports: [CategoryRepositoryModule, TasksRepositoryModule],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
