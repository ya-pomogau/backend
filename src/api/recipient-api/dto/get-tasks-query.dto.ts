/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { GetTasksDto } from '../../../common/dto/tasks.dto';

export class GetTasksQueryDto implements Partial<GetTasksDto> {
  @ApiProperty()
  @IsOptional()
  @IsString()
  categoryId: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  distance: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  end: Date;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  longitude: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  start: Date;
}

export class GetTasksSearchDto implements Partial<GetTasksDto> {
  @ApiProperty()
  @IsOptional()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @ValidateIf((obj) => obj.longitude !== undefined && obj.latitude !== undefined)
  @IsDefined()
  @IsNumber()
  @IsOptional()
  distance: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @ValidateIf((obj) => obj.distance !== undefined && obj.latitude !== undefined)
  @IsDefined()
  @IsNumber()
  @IsOptional()
  longitude: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @ValidateIf((obj) => obj.distance !== undefined && obj.longitude !== undefined)
  @IsDefined()
  @IsNumber()
  @IsOptional()
  latitude: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  end: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  start: Date;
}
