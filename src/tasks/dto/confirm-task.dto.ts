import { IsBoolean } from 'class-validator';
import validationOptions from '../../common/constants/validation-options';

export class ConfirmTaskDto {
  @IsBoolean({ message: validationOptions.messages.shouldBeBoolean })
  completed: boolean;
}
