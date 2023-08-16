import { IsString } from 'class-validator';

export class SigninResponseDto {
  @IsString()
  access_token: string;
}
