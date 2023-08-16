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
  fullname: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @MinLength(validationOptions.limits.login.min, {
    message: validationOptions.messages.tooShort,
  })
  @MaxLength(validationOptions.limits.login.max, {
    message: validationOptions.messages.tooLong,
  })
  login: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  password: string;

  @IsEnum(UserRole, {
    message: validationOptions.messages.strictValues + Object.values(UserRole).join(', '),
  })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  role: UserRole;

  @IsUrl({ require_protocol: true }, { message: validationOptions.messages.incorrectUrl })
  @IsOptional()
  avatar: string;

  @IsPhoneNumber('RU', { message: validationOptions.messages.incorrectPhoneNumber })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  phone: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @MinLength(validationOptions.limits.address.min, { message: validationOptions.messages.tooShort })
  @MaxLength(validationOptions.limits.address.max, { message: validationOptions.messages.tooLong })
  address: string;

  @IsArray({ message: validationOptions.messages.incorrectCoordinates })
  @IsNumber({}, { each: true, message: validationOptions.messages.incorrectCoordinates })
  @ArrayMinSize(2, { message: validationOptions.messages.incorrectCoordinates })
  @ArrayMaxSize(2, { message: validationOptions.messages.incorrectCoordinates })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
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
  permissions: AdminPermission[];
}
