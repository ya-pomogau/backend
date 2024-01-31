import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum, IsString, Min } from 'class-validator';
import { CategoryInterface } from 'src/common/types/category.types';
import { UserStatus } from 'src/common/types/user.types';

export class NewCategoryDto implements CategoryInterface {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  points: number;

  @ApiProperty()
  @IsEnum(UserStatus)
  @IsNotEmpty()
  accessLevel: UserStatus;
}
