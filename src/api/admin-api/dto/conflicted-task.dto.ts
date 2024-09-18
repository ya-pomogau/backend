import { ApiProperty } from '@nestjs/swagger';
import { TaskDto } from './created-task.dto';

export class ConflictedTasksDto {
  @ApiProperty({
    type: [TaskDto],
    description: 'Список конфликтных задач',
  })
  tasks: TaskDto[];
}
