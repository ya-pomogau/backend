import { ApiProperty } from '@nestjs/swagger';

export class DeletedTaskDto {
  @ApiProperty()
  acknowledged: boolean;

  @ApiProperty()
  deletedCount: number;
}
