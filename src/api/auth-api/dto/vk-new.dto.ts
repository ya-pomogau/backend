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
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty()
  @IsString()
  @IsPhoneNumber('RU')
  phone: string;

  @ApiProperty()
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
