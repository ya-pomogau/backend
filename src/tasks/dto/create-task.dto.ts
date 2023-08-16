import {IsDate, IsString, IsNotEmpty, MinLength, MaxLength, IsOptional} from 'class-validator';
import { Type } from 'class-transformer';
import validationOptions from '../../common/constants/validation-options';

export class CreateTaskDto {
  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @MinLength(validationOptions.limits.task.title.min, {
    message: validationOptions.messages.tooShort,
  })
  @MaxLength(validationOptions.limits.task.title.max, {
    message: validationOptions.messages.tooLong,
  })
  title: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @MinLength(validationOptions.limits.task.description.min, {
    message: validationOptions.messages.tooShort,
  })
  @MaxLength(validationOptions.limits.task.description.max, {
    message: validationOptions.messages.tooLong,
  })
  description: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  categoryId: string;

  @IsDate()
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @Type(() => Date)
  completionDate: Date;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @MinLength(validationOptions.limits.address.min, { message: validationOptions.messages.tooShort })
  @MaxLength(validationOptions.limits.address.max, { message: validationOptions.messages.tooLong })
  address: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsOptional()
  recipientId: string;
}
