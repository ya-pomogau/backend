import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import validationOptions from '../../common/constants/validation-options';
import { AdminPermission, UserRole } from '../types';

export class CreateAdminDto {
  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @MinLength(validationOptions.limits.userName.min, {
    message: validationOptions.messages.tooShort,
  })
  @MaxLength(validationOptions.limits.userName.max, {
    message: validationOptions.messages.tooLong,
  })
  @ApiProperty({ example: 'Василий' })
  fullname: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @MinLength(validationOptions.limits.login.min, {
    message: validationOptions.messages.tooShort,
  })
  @MaxLength(validationOptions.limits.login.max, {
    message: validationOptions.messages.tooLong,
  })
  @ApiProperty({ example: 'vasya' })
  login: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({ example: 'vasya123' })
  password: string;

  @IsEnum(UserRole, {
    message: validationOptions.messages.strictValues + Object.values(UserRole).join(', '),
  })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({ example: 'admin' })
  role: UserRole;

  @IsUrl({ require_protocol: true }, { message: validationOptions.messages.incorrectUrl })
  @IsOptional()
  @ApiProperty({
    example: 'https://w.forfun.com/fetch/aa/aaa5465c1c0026e54fa9dc7f8d35c3a9.jpeg',
    required: false,
  })
  avatar: string;

  @IsPhoneNumber('RU', { message: validationOptions.messages.incorrectPhoneNumber })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({ example: '892177776655' })
  phone: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @MinLength(validationOptions.limits.address.min, { message: validationOptions.messages.tooShort })
  @MaxLength(validationOptions.limits.address.max, { message: validationOptions.messages.tooLong })
  @ApiProperty({ example: 'СПб, Марата, 4' })
  address: string;

  @IsArray({ message: validationOptions.messages.incorrectCoordinates })
  @IsNumber({}, { each: true, message: validationOptions.messages.incorrectCoordinates })
  @ArrayMinSize(2, { message: validationOptions.messages.incorrectCoordinates })
  @ArrayMaxSize(2, { message: validationOptions.messages.incorrectCoordinates })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({ example: [59.930895, 30.355601] })
  coordinates: number[];

  @IsArray({ message: validationOptions.messages.incorrectAdminPermissions })
  @IsEnum(AdminPermission, {
    each: true,
    message: validationOptions.messages.strictValues + Object.values(AdminPermission).join(', '),
  })
  @ArrayMinSize(validationOptions.limits.adminPermissions.min, {
    message: validationOptions.messages.incorrectAdminPermissions,
  })
  @ArrayMaxSize(validationOptions.limits.adminPermissions.max, {
    message: validationOptions.messages.incorrectAdminPermissions,
  })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({
    example: [
      'create tasks',
      'confirm users',
      'give keys',
      'resolve conflicts',
      'write the blog',
      'change categories',
    ],
  })
  permissions: AdminPermission[];
}
