import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class TaskQueryDto {
  @ApiProperty({ example: 'created,accepted,closed', required: false })
  @IsOptional()
  status?: string;

  @ApiProperty({ example: '64dc866e64be7861efbdec49d,64dc86b164be7861efbdec4a', required: false })
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ example: '64db8efbe754d48c873030dc', required: false })
  @IsOptional()
  recipientId?: string;

  @ApiProperty({ example: '64dbbda56f684bcb8dc7f5b8', required: false })
  @IsOptional()
  volunteerId?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  completed?: boolean;
}
