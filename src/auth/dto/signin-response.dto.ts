import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninResponseDto {
  @IsString()
  @ApiProperty()
  access_token: string;
}
