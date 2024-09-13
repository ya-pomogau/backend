/* eslint-disable max-classes-per-file */

import { IsIn, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NewProfileInterface } from '../types/api.types';
import { GeoCoordinates, PointGeoJSONInterface } from '../types/point-geojson.types';
import { IsCoords } from '../decorators/is-coords';

export class PointGeoJSONDto implements PointGeoJSONInterface {
  @IsCoords()
  @IsNotEmpty()
  @ApiProperty()
  coordinates: GeoCoordinates;

  @ApiProperty()
  @IsIn(['Point'])
  type: 'Point';
}

export class NewProfileDto implements NewProfileInterface {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsPhoneNumber('RU')
  phone: string;
}
