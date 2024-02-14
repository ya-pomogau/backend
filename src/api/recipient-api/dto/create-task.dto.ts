import { ApiProperty } from '@nestjs/swagger';
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
import { CreateTaskDto } from '../../../common/dto/tasks.dto';
import { GeoCoordinates } from '../../../common/types/point-geojson.types';

export class ApiCreateTaskDto implements Omit<CreateTaskDto, 'recipientId'> {
  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ required: true })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  location: GeoCoordinates;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  date: Date | null;

  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  description: string;
}
