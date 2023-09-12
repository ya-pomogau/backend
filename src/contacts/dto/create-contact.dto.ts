import { IsNotEmpty, IsEmail, IsUrl, IsArray } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import validationOptions from '../../common/constants/validation-options';

export class CreateContactDto {
  @IsEmail({}, { message: validationOptions.messages.shouldBeEmail })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({ example: 'www@yandex.ru' })
  email: string;

  @IsUrl(
    { require_protocol: true },
    {
      each: true,
      message: validationOptions.messages.incorrectUrl,
    }
  )
  @IsArray({ message: validationOptions.messages.shouldBeArray })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({ example: ['https://vk.com/me2help'] })
  social: string[];
}
