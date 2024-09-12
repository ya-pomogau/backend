import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InTaskUserDto {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  avatar: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  _id: string;
}
