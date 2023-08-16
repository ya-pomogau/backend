import { IsInt, IsNotEmpty, IsPositive, IsString, Length, MaxLength, MinLength } from "class-validator";
import validationOptions from '../../common/constants/validation-options';

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
}
