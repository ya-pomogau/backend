import {
  IsNotEmpty,
  IsUrl,
  Length,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { UserRole, StatusType, PermissionType } from '../../common/types/user-types';

export class CreateUserDto {
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должен быть пустым' })
  @Length(2, 30, { message: 'должен быть не меньше 2 и не больше 30' })
  fullname: string;

  @IsEnum(UserRole, { message: 'Некорректное значение статуса' })
  role: UserRole | null;

  @IsEnum(StatusType, { message: 'Некорректное значение статуса' })
  status: StatusType = StatusType.Unconfirmed;

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
  @IsNumber()
  keys?: number | null;

  @IsOptional()
  @IsNumber()
  scores?: number = 0;

  @IsOptional()
  permissions?: Array<PermissionType> | null;
}
