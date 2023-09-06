import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import validationOptions from '../../common/constants/validation-options';

export class ConfirmTaskDto {
  @IsBoolean({ message: validationOptions.messages.shouldBeBoolean })
  @ApiProperty({ example: true })
  completed: boolean;
}
