import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EUserRole } from '../../users/types';

export interface ICallbackQueryDto {
  role: EUserRole;
  error?: string;
  code?: string;
  error_description?: string;
}

export class CallbackQueryDto implements ICallbackQueryDto {
  @ApiProperty({ example: EUserRole.VOLUNTEER, required: true, enum: EUserRole })
  @IsEnum(EUserRole)
  role: EUserRole;

  @ApiProperty({ required: false })
  @IsOptional()
  error?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  code?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  error_description?: string;
}
