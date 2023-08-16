import {
  IsDate,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsArray,
  IsNumber,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'Прошу купить свёклу' })
  title: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @MinLength(validationOptions.limits.task.description.min, {
    message: validationOptions.messages.tooShort,
  })
  @MaxLength(validationOptions.limits.task.description.max, {
    message: validationOptions.messages.tooLong,
  })
  @ApiProperty({ example: 'Прошу купить свёклу для борща' })
  description: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({ example: '64dc866e64be7861efbdec49' })
  categoryId: string;

  @IsDate()
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @Type(() => Date)
  @ApiProperty({ example: new Date('2024-01-01') })
  completionDate: Date;

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

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsOptional()
  @ApiProperty({ example: '64db8efbe754d48c873030dc', required: false })
  recipientId: string;
}
