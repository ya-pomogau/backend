import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VKLoginDtoInterface } from '../../../common/types/api.types';

export class VkLoginDto implements VKLoginDtoInterface {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  redirectUrl: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  state: string;
}
