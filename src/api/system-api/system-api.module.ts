import { Module } from '@nestjs/common';
import { BlogModule } from '../../core/blog/blog.module';
import { SystemApiController } from './system-api.controller';
import { CategoriesModule } from '../../core/categories/categories.module';
import { TasksModule } from '../../core/tasks/tasks.module';

@Module({
  imports: [BlogModule, CategoriesModule, TasksModule],
  controllers: [SystemApiController],
  providers: [],
})
export class SystemApiModule {}
