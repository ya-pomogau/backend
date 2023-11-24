import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class SigninResponseDto {
  @IsString()
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: User;
}
