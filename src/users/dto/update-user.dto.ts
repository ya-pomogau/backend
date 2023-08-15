import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import validationOptions from '../../common/constants/validation-options';

export class UpdateUserDto {
  @IsString({ message: validationOptions.messages.shouldBeString })
  @MinLength(validationOptions.limits.userName.min, {
    message: validationOptions.messages.tooShort,
  })
  @MaxLength(validationOptions.limits.userName.max, {
    message: validationOptions.messages.tooLong,
  })
  @IsOptional()
  fullname: string;

  @IsUrl({ require_protocol: true }, { message: validationOptions.messages.incorrectUrl })
  @IsOptional()
  vk: string;

  @IsUrl({ require_protocol: true }, { message: validationOptions.messages.incorrectUrl })
  @IsOptional()
  avatar: string;

  @IsPhoneNumber('RU', { message: validationOptions.messages.incorrectPhoneNumber })
  @IsOptional()
  phone: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @MinLength(validationOptions.limits.address.min, { message: validationOptions.messages.tooShort })
  @MaxLength(validationOptions.limits.address.max, { message: validationOptions.messages.tooLong })
  @IsOptional()
  address: string;

  @IsArray({ message: validationOptions.messages.incorrectCoordinates })
  @IsNumber({}, { each: true, message: validationOptions.messages.incorrectCoordinates })
  @ArrayMinSize(2, { message: validationOptions.messages.incorrectCoordinates })
  @ArrayMaxSize(2, { message: validationOptions.messages.incorrectCoordinates })
  @IsOptional()
  coordinates: number[];
}
