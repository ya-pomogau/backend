import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { EUserRole } from '../../users/types';

export interface ICallbackQueryDto {
  role?: EUserRole;
  fullname?: string;
  phone?: string;
  address?: string;
  signup?: string;
  error?: string;
  code?: string;
  error_description?: string;
}

export class CallbackQueryDto implements ICallbackQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  error?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  code?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  error_description?: string;

  @ApiProperty({ example: 'Георгий', required: false })
  @IsOptional()
  fullname?: string;

  @ApiProperty({ example: 'recipient', required: false })
  @IsOptional()
  role?: EUserRole;

  @ApiProperty({ example: '89213322232', required: false })
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Спб, Невский, 100', required: false })
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '59.932031,30.355628', required: false })
  @IsOptional()
  coordinates?: string;

  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  signup?: string;
}
