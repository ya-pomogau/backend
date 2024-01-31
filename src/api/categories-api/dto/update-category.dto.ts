import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsEnum, IsString, Min } from 'class-validator';
import { NewCategoryDto } from './new-category.dto';
import { UserStatus } from 'src/common/types/user.types';

export class UpdateCategoryDto extends PartialType(NewCategoryDto) {
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
