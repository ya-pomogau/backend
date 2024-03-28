import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ApiUnauthorized {
  @ApiProperty({ example: 'Unauthorized' })
  message: string;

  @ApiProperty({ example: HttpStatus.UNAUTHORIZED })
  statusCode: number;
}
