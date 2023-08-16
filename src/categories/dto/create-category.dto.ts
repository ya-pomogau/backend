import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString, Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import validationOptions from '../../common/constants/validation-options';
import { UserStatus } from '../../users/types';

export class CreateCategoryDto {
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @IsString({ message: validationOptions.messages.shouldBeString })
  @MinLength(validationOptions.limits.categoryTitle.min, {
    message: validationOptions.messages.tooShort,
  })
  @MaxLength(validationOptions.limits.categoryTitle.max, {
    message: validationOptions.messages.tooLong,
  })
  title: string;

  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @IsInt({
    message: validationOptions.messages.shouldBeIntegerNumber,
  })
  @IsPositive({
    message: validationOptions.messages.shouldBePositiveNumber,
  })
  points: number;

  @IsInt({
    message: validationOptions.messages.shouldBeIntegerNumber,
  })
  @Min(validationOptions.limits.categoryAccess.min, { message: validationOptions.messages.min })
  @Max(validationOptions.limits.categoryAccess.max, { message: validationOptions.messages.max })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  accessStatus: number;
}
