import { IsInt, IsNotEmpty, Max, Min} from 'class-validator';
import { UserStatus } from '../types';
import validationOptions from '../../common/constants/validation-options';

export class ChangeStatusDto {
  @IsInt({
    message: validationOptions.messages.shouldBeIntegerNumber,
  })
  @Min(validationOptions.limits.userStatus.min, { message: validationOptions.messages.min })
  @Max(validationOptions.limits.userStatus.max, { message: validationOptions.messages.max })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  status: number;
}
