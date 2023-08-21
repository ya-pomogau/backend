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

export class CreateUserDto {
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должен быть пустым' })
  @Length(2, 30, { message: 'должен быть не меньше 2 и не больше 30' })
  fullname: string;

  role: UserRole | null;

  status: StatusType | null;

  @IsNotEmpty({ message: 'VK ID не должен быть пустым' })
  vkId: number;

  @IsUrl({ require_protocol: true }, { message: 'Не корректный URL' })
  @IsNotEmpty({ message: 'Адрес не должен быть пустым' })
  vk: string;

  @IsUrl({ require_protocol: true }, { message: 'Не корректный URL' })
  @IsNotEmpty({ message: 'Адрес не должен быть пустым' })
  avatar: string;

  @IsPhoneNumber('RU', { message: 'Некорректный номер телефона' })
  phone: string;

  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Адрес не должен быть пустым' })
  @MinLength(6, { message: 'должен быть больше 6' })
  address: string;

  @IsNotEmpty({ message: 'Заполните поле для координат' })
  coordinates: number[];

  @IsOptional()
  keys?: number | null;

  @IsOptional()
  scores?: number;

  @IsOptional()
  permissions?: Array<PermissionType> | null;
}
