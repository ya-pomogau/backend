import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { EUserRole, UserStatus } from '../types';

export class UserQueryDto {
  @ApiProperty({ example: EUserRole.RECIPIENT, required: false, enum: EUserRole })
  @IsOptional()
  role?: string;

  @ApiProperty({ example: UserStatus.UNCONFIRMED, required: false, enum: UserStatus })
  @IsOptional()
  status?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  isBlocked?: boolean;
}
