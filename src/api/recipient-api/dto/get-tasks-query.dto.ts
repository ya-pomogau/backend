/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { GeoCoordinates } from '../../../common/types/point-geojson.types';
import { GetTasksDto } from '../../../common/dto/tasks.dto';

export class GetTasksQueryDto implements Partial<GetTasksDto> {
  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryId: string;

  @ApiProperty({ required: true })
  @IsNumber()
  distance: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  end: Date;

  @ApiProperty({ required: true })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  location: GeoCoordinates;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  start: Date;
}

export class GetTasksSearchDto implements Partial<GetTasksDto> {
  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryId: string;

  @ApiProperty()
  @ValidateIf((obj) => obj.location !== undefined)
  @IsDefined()
  @IsNumber()
  @IsOptional()
  distance: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  end: Date;

  @ApiProperty()
  @ValidateIf((obj) => obj.distance !== undefined)
  @IsDefined()
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  location: GeoCoordinates;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  start: Date;
}
