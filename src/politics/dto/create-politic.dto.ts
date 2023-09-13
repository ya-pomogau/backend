import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import validationOptions from '../../common/constants/validation-options';

export class CreatePoliticDto {
  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({ example: 'Политика конфиденциальности' })
  title: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({
    example:
      '<h2>1. Общие положения</h2> <p>Настоящая политика обработки персональных данных составлена в соответствии с требованиями Федерального закона...</p>',
  })
  text: string;
}
