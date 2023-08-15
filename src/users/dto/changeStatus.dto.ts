import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../types';
import validationOptions from '../../common/constants/validation-options';

export class ChangeStatusDto {
  @IsEnum(UserStatus, {
    message: validationOptions.messages.strictValues + Object.values(UserStatus).join(', '),
  })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  status: UserStatus;
}
