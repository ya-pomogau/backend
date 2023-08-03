import { IsNotEmpty, IsString, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class CreateAdminDto  {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsString()
  vk: string;

  @IsNotEmpty()
  @IsString()
  photo: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsArray()
  @IsArray({ each: true })
  coordinates: number[];

  @IsOptional()
  @IsBoolean()
  approved: boolean;

  @IsOptional()
  @IsString()
  adminStatus: string;
}
