import {
  IsNotEmpty,
  IsUrl,
  Length,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должен быть пустым' })
  @Length(2, 30, { message: 'должен быть не меньше 2 и не больше 30' })
  fullname: string;

  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'Не корректный URL' })
  @IsNotEmpty({ message: 'Адрес не должен быть пустым' })
  vk: string;

  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'Не корректный URL' })
  @IsNotEmpty({ message: 'Адрес не должен быть пустым' })
  photo: string;

  @IsOptional()
  @IsPhoneNumber('RU', { message: 'Некорректный номер телефона' })
  phone: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Адрес не должен быть пустым' })
  @MinLength(6, { message: 'должен быть больше 6' })
  address: string;

  @IsOptional()
  role: UserRole;

  @IsOptional()
  coordinates: number[];

  @IsOptional()
  approved: boolean;

  @IsOptional()
  checked: boolean;

  @IsOptional()
  keys: boolean;

  @IsOptional()
  scores: number;

  @IsOptional()
  completed: number;
}
