import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UpdatePasswordDto } from '../../../common/types/api.types';

export class SetAdminPasswordDto implements UpdatePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
