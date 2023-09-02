import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { EDisplay, EResponseType, EScope } from '../types/enums';
import { EUserRole } from '../../users/types';

export interface ILoginVkQueryDto {
  role?: EUserRole;
  display?: EDisplay;
  scope?: EScope;
  responseType?: EResponseType;
}

export class LoginVkQueryDto implements ILoginVkQueryDto {
  @ApiProperty({ example: EDisplay.page, required: false, enum: EDisplay })
  @IsOptional()
  display? = EDisplay.page;

  @ApiProperty({ example: EScope.friends, required: false, enum: EScope })
  @IsOptional()
  scope? = EScope.friends;

  @ApiProperty({ example: EResponseType.code, required: false, enum: EResponseType })
  @IsOptional()
  responseType? = EResponseType.code;
}
