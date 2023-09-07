import {
  IsNotEmpty,
  IsUrl,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsEnum,
  MaxLength,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber, IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { EUserRole } from '../types';

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
  @ApiProperty({ example: 'Георгий' })
  fullname: string;

  @IsEnum(EUserRole, {
    message: validationOptions.messages.strictValues + Object.values(EUserRole).join(', '),
  })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({ example: 'recipient' })
  role: EUserRole;

  @IsNumber({}, { message: validationOptions.messages.shouldBePositiveNumber })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  vkId: number;

  @IsUrl({ require_protocol: true }, { message: validationOptions.messages.incorrectUrl })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({ example: 'https://vk.com/gosha-recipient' })
  vkLink: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  login: string;

  @IsUrl({ require_protocol: true }, { message: validationOptions.messages.incorrectUrl })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({
    example:
      'https://webpulse.imgsmail.ru/imgpreview?key=pulse_cabinet-image-88e86878-e1f3-4876-8597-91e4d4bd44fc&mb=webpulse',
  })
  avatar: string;

  @IsPhoneNumber('RU', { message: validationOptions.messages.incorrectPhoneNumber })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({ example: '89213322232' })
  phone: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @MinLength(validationOptions.limits.address.min, { message: validationOptions.messages.tooShort })
  @MaxLength(validationOptions.limits.address.max, { message: validationOptions.messages.tooLong })
  @ApiProperty({ example: 'Спб, Невский, 100' })
  address: string;

  @IsArray({ message: validationOptions.messages.incorrectCoordinates })
  @IsNumber({}, { each: true, message: validationOptions.messages.incorrectCoordinates })
  @ArrayMinSize(2, { message: validationOptions.messages.incorrectCoordinates })
  @ArrayMaxSize(2, { message: validationOptions.messages.incorrectCoordinates })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({ example: [59.932031, 30.355628] })
  coordinates: number[];
}
