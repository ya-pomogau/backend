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
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole, StatusType } from '../entities/user.entity';
import { PermissionTypeDto } from './permisionType.dto';
import { PermissionTypeValidator } from './PermissionTypeValidator.dto';

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
  @IsNotEmpty({ message: 'Поле vk не должно быть пустым' })
  vk: string;

  @IsUrl({ require_protocol: true }, { message: 'Не корректный URL' })
  @IsNotEmpty({ message: 'Поле avatar не должно быть пустым' })
  avatar: string;

  @IsPhoneNumber('RU', { message: 'Некорректный номер телефона' })
  @IsNotEmpty({ message: 'Поле phone не должно быть пустым' })
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
  @IsInt({ message: 'Поле scores должно быть целым числом' })
  @Min(0, { message: 'Поле scores не должно быть меньше 0' })
  scores?: number = 0;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PermissionTypeValidator)
  permissions?: PermissionTypeDto[] | null;
}
