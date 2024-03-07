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
  @IsDefined()
  @IsNotEmpty()
  @IsString()
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
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  description: string;
}
