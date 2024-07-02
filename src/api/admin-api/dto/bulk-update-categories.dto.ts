import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiBulkUpdateCategoryDto } from './bulk-update-category.dto';

export class ApiBulkUpdateCategoriesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  data: Array<ApiBulkUpdateCategoryDto>;
}
