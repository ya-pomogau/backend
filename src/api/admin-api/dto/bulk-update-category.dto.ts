import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiCreateCategoryDto } from './new-category.dto';
import { BulkUpdateCategoryInterface } from '../../../common/types/category.types';

export class ApiBulkUpdateCategoryDto
  extends ApiCreateCategoryDto
  implements BulkUpdateCategoryInterface
{
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;
}
