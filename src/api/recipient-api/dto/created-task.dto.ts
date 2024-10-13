import { ApiProperty } from '@nestjs/swagger';
import { PointGeoJSONDto } from '../../../common/dto/api.dto';
import { ResolveStatus, TaskReport, TaskStatus } from '../../../common/types/task.types';
import { CategoryDto } from '../../../common/dto/category.dto';
import { InTaskUserDto } from './in-task-user.dto';

export class CreatedTaskDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  status: TaskStatus.CREATED;

  @ApiProperty()
  adminResolve: ResolveStatus | null;

  @ApiProperty()
  moderator: InTaskUserDto | null;

  @ApiProperty()
  category: CategoryDto;

  @ApiProperty()
  date: Date | null;

  @ApiProperty({
    type: PointGeoJSONDto,
  })
  location: PointGeoJSONDto;

  @ApiProperty()
  recipient: InTaskUserDto;

  @ApiProperty()
  recipientReport: TaskReport | null;

  @ApiProperty()
  volunteer: InTaskUserDto | null;

  @ApiProperty()
  volunteerReport: TaskReport | null;

  @ApiProperty()
  isPendingChanges: boolean;

  @ApiProperty()
  description: string;

  @ApiProperty()
  _id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
