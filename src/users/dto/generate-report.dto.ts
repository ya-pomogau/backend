import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import validationOptions from '../../common/constants/validation-options';
import { EUserRole, ReportRole, ReportStatus } from '../types';

export class GenerateReportDto {
  @ApiProperty({ example: ReportStatus.ACTIVE, enum: ReportStatus })
  @IsEnum(ReportStatus)
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  reportStatus: ReportStatus;

  @ApiProperty({ example: ReportRole.VOLUNTEER, enum: ReportRole })
  @IsEnum(ReportRole)
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  reportRole: EUserRole;
}
