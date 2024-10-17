/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VKNewUserInterface } from '../../../common/types/api.types';
import { UserRole } from '../../../common/types/user.types';
import { PointGeoJSONDto } from '../../../common/dto/api.dto';

export class VKNewUserDto implements VKNewUserInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsPhoneNumber('RU')
  phone: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty()
  @IsString()
  vkId: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => PointGeoJSONDto)
  location: PointGeoJSONDto;
}
