import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { Type } from 'class-transformer';
import { TaskStatus } from '../types';
import validationOptions from '../../common/constants/validation-options';

export class GenerateReportDto {
  @ApiProperty({ example: TaskStatus.ACCEPTED, enum: TaskStatus })
  @IsEnum(TaskStatus)
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  status: TaskStatus;

  @ApiProperty({ example: '2023-09-01T15:20:34.901Z' })
  @IsDate({ message: validationOptions.messages.incorrectReportDates })
  @Type(() => Date)
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  startDate: Date;

  @ApiProperty({ example: '2023-09-10T15:20:34.901Z' })
  @IsDate({ message: validationOptions.messages.incorrectReportDates })
  @Type(() => Date)
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  endDate: Date;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  check?: boolean;
}
