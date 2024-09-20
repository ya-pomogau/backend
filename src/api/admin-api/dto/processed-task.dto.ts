import { ApiProperty } from '@nestjs/swagger';
import { CreatedCategoryDto } from './created-category.dto';
import { UserDto } from './user.dto';
import { ResolveStatus, TaskInterface, TaskReport, TaskStatus } from 'src/common/types/task.types';
import { PointGeoJSONInterface } from 'src/common/types/point-geojson.types';
import { UserProfile } from 'src/common/types/user.types';

class LocationDto implements PointGeoJSONInterface {
  @ApiProperty({ example: 'Point', description: 'Тип местоположения' })
  type: 'Point';

  @ApiProperty({
    example: [47.249366, 39.710494],
    description: 'Координаты местоположения',
  })
  coordinates: [number, number];

  @ApiProperty({
    example: '66bcbaf831bd2d046260a91c',
    description: 'Идентификатор местоположения',
  })
  _id: string;

  @ApiProperty({
    example: '2024-08-14T14:11:04.559Z',
    description: 'Дата создания местоположения',
  })
  createdAt: string;

  @ApiProperty({
    example: '2024-08-14T14:11:04.559Z',
    description: 'Дата обновления местоположения',
  })
  updatedAt: string;
}

export class ProcessedTaskDto implements TaskInterface {
  @ApiProperty({
    example: '66bcbaf831bd2d046260a91a',
    description: 'Идентификатор задачи',
  })
  _id: string;

  @ApiProperty({
    example: 'Ростов-на-Дону, проспект Ленина, 99',
    description: 'Адрес задачи',
  })
  address: string;

  @ApiProperty({
    example: 'conflicted',
    description: 'Статус задачи',
  })
  status: TaskStatus;

  @ApiProperty({
    example: 'virgin',
    description: 'Состояние разрешения администратором',
  })
  adminResolve: ResolveStatus | null;

  @ApiProperty({
    example: null,
    description: 'Модератор, назначенный на задачу',
  })
  moderator: UserProfile | null;

  @ApiProperty({
    type: CreatedCategoryDto,
    description: 'Категория задачи',
  })
  category: CreatedCategoryDto;

  @ApiProperty({
    example: '2024-08-14T14:20:00.000Z',
    description: 'Дата задачи',
  })
  date: Date | null;

  @ApiProperty({
    type: LocationDto,
    description: 'Местоположение задачи',
  })
  location: LocationDto;

  @ApiProperty({
    type: UserDto,
    description: 'Получатель задачи',
  })
  recipient: UserDto;

  @ApiProperty({
    example: 'rejected',
    description: 'Отчёт получателя',
  })
  recipientReport: TaskReport | null;

  @ApiProperty({
    type: UserDto,
    description: 'Волонтёр, назначенный на задачу',
  })
  volunteer: UserDto;

  @ApiProperty({
    example: 'fulfilled',
    description: 'Отчёт волонтёра',
  })
  volunteerReport: TaskReport | null;

  @ApiProperty({
    example: true,
    description: 'Имеются ли ожидающие изменения',
  })
  isPendingChanges: boolean;

  @ApiProperty({
    example: 'Досуг! (менее 24 часов)',
    description: 'Описание задачи',
  })
  description: string;

  @ApiProperty({
    example: '2024-08-14T14:11:04.560Z',
    description: 'Дата создания задачи',
  })
  createdAt: string;

  @ApiProperty({
    example: '2024-08-14T14:31:55.665Z',
    description: 'Дата обновления задачи',
  })
  updatedAt: string;
}
