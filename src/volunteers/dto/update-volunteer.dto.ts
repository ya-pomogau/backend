import {
  IsNotEmpty,
  IsUrl,
  Length,
  IsString,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';

enum UserRole {
  ADMIN = 'admin',
  VOLUNTEER = 'volunteer',
  GUEST = 'recipient',
}

export enum VolunteerStatus {
  NOT_APPROVED = 'не одобрен',
  APPROVED = 'одобрен',
  APPROVED_CHECKED = 'одобрен и проверен',
  APPROVED_CHECKED_ACTIVATED = 'одобрен проверен активирован ключ',
}

export class UpdateVolunteerDto {
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должен быть пустым' })
  @Length(2, 30, { message: 'должен быть не меньше 2 и не больше 30' })
  fullname: string;

  role: UserRole;

  @IsUrl({ require_protocol: true }, { message: 'Не корректный URL' })
  @IsNotEmpty({ message: 'Адрес не должен быть пустым' })
  vk: string;

  @IsUrl({ require_protocol: true }, { message: 'Не корректный URL' })
  @IsNotEmpty({ message: 'Адрес не должен быть пустым' })
  photo: string;

  @IsPhoneNumber('RU', { message: 'Некорректный номер телефона' })
  phone: string;

  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Адрес не должен быть пустым' })
  @MinLength(6, { message: 'должен быть больше 6' })
  address: string;

  coordinates: number[];

  status: VolunteerStatus;
}
