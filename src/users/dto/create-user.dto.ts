import { IsNotEmpty, IsUrl, Length, IsString, MinLength, IsPhoneNumber } from 'class-validator';

enum UserRole {
  ADMIN = 'администратор',
  VOLUNTEER = 'Реципиент',
  RECIPIENT = 'Волонтер',
}

export class CreateUserDto {
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должен быть пустым' })
  @Length(2, 30, { message: 'должен быть не меньше 2 и не больше 30' })
  fullname: string;

  @IsNotEmpty({ message: 'Адрес не должен быть пустым' })
  vk: string;

  role: UserRole;

  @IsNotEmpty({ message: 'Адрес не должен быть пустым' })
  photo: string;

  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Адрес не должен быть пустым' })
  @MinLength(6, { message: 'должен быть больше 6' })
  address: string;

  @IsPhoneNumber('RU', { message: 'Некорректный номер телефона' })
  phone: string;

  coordinates: number[];
}
