import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class AdminLoginDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  @ApiProperty()
  login: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  password: string;
}
