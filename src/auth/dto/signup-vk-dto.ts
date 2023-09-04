import { IsNotEmpty, IsString, MinLength, IsPhoneNumber, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import validationOptions from '../../common/constants/validation-options';
import { EUserRole } from '../../users/types';

export class SignupVkDto {
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

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({ example: '59.932031,30.355628' })
  coordinates: string;
}
