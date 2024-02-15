/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { GetTasksDto } from '../../../common/dto/tasks.dto';

export class GetTasksQueryDto implements Partial<GetTasksDto> {
  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryId: string;

  @ApiProperty({ required: true })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  distance: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  end: Date;

  @ApiProperty({ required: true })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  longitude: number;

  @ApiProperty({ required: true })
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
  @IsString()
  @IsOptional()
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
  @IsDate()
  end: Date;

  /* @ApiProperty()
  @ValidateIf((obj) => obj.distance !== undefined)
  @IsDefined()
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  location: GeoCoordinates; */

  @ApiProperty()
  @IsOptional()
  @IsDate()
  start: Date;
}
