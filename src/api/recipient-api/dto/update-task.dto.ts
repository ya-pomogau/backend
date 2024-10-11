import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiCreateTaskDto } from './create-task.dto';

export class ApiUpdateTaskDto extends PartialType(ApiCreateTaskDto) {
  @ApiProperty({ required: false })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({ required: false, type: [Number, Number], example: [58, 58] })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  location: [number, number];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date: Date | null;

  @ApiProperty({ required: false })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  description: string;
}
