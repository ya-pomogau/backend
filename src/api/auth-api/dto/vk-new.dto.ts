/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VKNewUserInterface, VKNewUserProfileInterface } from '../../../common/types/api.types';
import { UserRole } from '../../../common/types/user.types';
import { IsCoords } from '../../../common/decorators/is-coords';
import { GeoCoordinates, PointGeoJSONInterface } from '../../../common/types/point-geojson.types';

class PointGeoJSONDto implements PointGeoJSONInterface {
  @IsCoords()
  @IsNotEmpty()
  coordinates: GeoCoordinates;

  @IsIn(['Point'])
  type: 'Point';
}

class VKNewUserProfileDto implements VKNewUserProfileInterface {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsPhoneNumber('RU')
  phone: string;
}

export class VKNewUserDto implements VKNewUserInterface {
  @ApiProperty()
  @ValidateNested()
  @Type(() => VKNewUserProfileDto)
  profile: VKNewUserProfileDto;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  vkId: string;

  @ValidateNested({ each: true })
  @Type(() => PointGeoJSONDto)
  location: PointGeoJSONDto;
}
