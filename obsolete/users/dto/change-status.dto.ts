import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import validationOptions from '../../../src/common/constants/validation-options';

import { UserStatus } from '../types';

export class ChangeStatusDto {
  @IsInt({
    message: validationOptions.messages.shouldBeIntegerNumber,
  })
  @Min(validationOptions.limits.userStatus.min, { message: validationOptions.messages.min })
  @Max(validationOptions.limits.userStatus.max, { message: validationOptions.messages.max })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({ example: UserStatus.VERIFIED, enum: UserStatus })
  status: number;
}
