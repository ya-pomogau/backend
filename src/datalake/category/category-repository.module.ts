import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { CategoryRepository } from './category.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  providers: [CategoryRepository],
  exports: [CategoryRepository],
})
export class CategoryRepositoryModule {}
