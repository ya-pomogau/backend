import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MockLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  vkId: string;
}
