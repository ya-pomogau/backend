import {
  IsNotEmpty,
  IsUrl,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { AdminPermission, UserRole } from '../types';
import validationOptions from '../../common/constants/validation-options';

export class CreateUserDto {
  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @MinLength(validationOptions.limits.userName.min, {
    message: validationOptions.messages.tooShort,
  })
  @MaxLength(validationOptions.limits.userName.max, {
    message: validationOptions.messages.tooLong,
  })
  fullname: string;

  @IsEnum(UserRole, {
    message: validationOptions.messages.strictValues + Object.values(UserRole).join(', '),
  })
  role: UserRole;

  @IsUrl({ require_protocol: true }, { message: validationOptions.messages.incorrectUrl })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  vk: string;

  @IsUrl({ require_protocol: true }, { message: validationOptions.messages.incorrectUrl })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  avatar: string;

  @IsPhoneNumber('RU', { message: validationOptions.messages.incorrectPhoneNumber })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  phone: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @MinLength(validationOptions.limits.address.min, { message: validationOptions.messages.tooShort })
  @MaxLength(validationOptions.limits.address.max, { message: validationOptions.messages.tooLong })
  address: string;

  @IsNotEmpty({ message: validationOptions.messages.incorrectCoordinates })
  coordinates: number[];

  @IsOptional()
  @IsEnum(AdminPermission, {
    each: true,
    message: validationOptions.messages.strictValues + Object.values(AdminPermission).join(', '),
  })
  permissions?: AdminPermission[];
}
