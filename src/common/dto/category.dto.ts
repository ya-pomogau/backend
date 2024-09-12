import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { UserStatus } from '../types/user.types';

export type CreateCategoryDto = {
  title: string;
  points: number;
  accessLevel: UserStatus;
};

export type UpdateCategoryDto = Partial<CreateCategoryDto> & {
  _id?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export class CategoryDto {
  @IsString()
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  points: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  accessLevel: number;
}
