import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { PointGeoJSONDto } from '../../../common/dto/api.dto';
import { ResolveStatus, TaskReport, TaskStatus } from '../../../common/types/task.types';
import { CategoryDto } from '../../../common/dto/category.dto';
import { InTaskUserDto } from './in-task-user.dto';

export class CreatedTaskDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: TaskStatus.CREATED;

  @ApiProperty()
  @IsNotEmpty()
  adminResolve: ResolveStatus | null;

  @ApiProperty()
  @IsNotEmpty()
  moderator: InTaskUserDto | null;

  @ApiProperty()
  @IsNotEmpty()
  category: CategoryDto;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  date: Date | null;

  @ApiProperty({
    type: PointGeoJSONDto,
  })
  @IsNotEmpty()
  location: PointGeoJSONDto;

  @ApiProperty()
  @IsNotEmpty()
  recipient: InTaskUserDto;

  @ApiProperty()
  @IsNotEmpty()
  recipientReport: TaskReport | null;

  @ApiProperty()
  @IsNotEmpty()
  volunteer: InTaskUserDto | null;

  @ApiProperty()
  @IsNotEmpty()
  volunteerReport: TaskReport | null;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isPendingChanges: boolean;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  _id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
