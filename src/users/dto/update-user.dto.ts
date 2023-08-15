import {
  IsNotEmpty,
  IsUrl,
  Length,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';
import { UserRole, StatusType, PermissionType } from '../../common/types/user-types';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должен быть пустым' })
  @Length(2, 30, { message: 'должен быть не меньше 2 и не больше 30' })
  fullname: string;

  @IsOptional()
  role: UserRole | null;

  @IsOptional()
  status: StatusType | null;

  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'Не корректный URL' })
  @IsNotEmpty({ message: 'Адрес не должен быть пустым' })
  vk: string;

  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'Не корректный URL' })
  @IsNotEmpty({ message: 'Адрес не должен быть пустым' })
  avatar: string;

  @IsOptional()
  @IsPhoneNumber('RU', { message: 'Некорректный номер телефона' })
  phone: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Адрес не должен быть пустым' })
  @MinLength(6, { message: 'должен быть больше 6' })
  address: string;

  @IsOptional()
  coordinates: number[];

  @IsOptional()
  keys?: number | null;

  @IsOptional()
  scores?: number;

  @IsOptional()
  permissions?: Array<PermissionType> | null;
}
