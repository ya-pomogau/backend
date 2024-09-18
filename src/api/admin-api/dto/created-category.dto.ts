import { ApiProperty } from '@nestjs/swagger';

export class CreatedCategoryDto {
  @ApiProperty({ example: '66ea95fbeb4ba9b5f01271ad', description: 'Уникальный идентификатор категории' })
  _id: string;

  @ApiProperty({ example: 'Test category', description: 'Название категории', required: true })
  title: string;

  @ApiProperty({ example: 2, description: 'Количество очков за выполнение задачи', required: true })
  points: number;

  @ApiProperty({ example: 2, description: 'Уровень доступа категории', required: true })
  accessLevel: number;

  @ApiProperty({ example: '2024-09-18T08:57:31.294Z', description: 'Дата создания категории' })
  createdAt: string;

  @ApiProperty({ example: '2024-09-18T08:57:31.294Z', description: 'Дата последнего обновления категории' })
  updatedAt: string;
}
