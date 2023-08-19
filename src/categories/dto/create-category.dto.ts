import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'Покупка продуктов' })
  title: string;

  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @IsInt({
    message: validationOptions.messages.shouldBeIntegerNumber,
  })
  @IsPositive({
    message: validationOptions.messages.shouldBePositiveNumber,
  })
  @ApiProperty({ example: 5 })
  points: number;

  @IsInt({
    message: validationOptions.messages.shouldBeIntegerNumber,
  })
  @Min(validationOptions.limits.categoryAccess.min, { message: validationOptions.messages.min })
  @Max(validationOptions.limits.categoryAccess.max, { message: validationOptions.messages.max })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({ example: 1 })
  accessStatus: number;
}
