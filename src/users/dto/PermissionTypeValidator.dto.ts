import { IsEnum, IsNumber } from 'class-validator';
import { PermissionTypeDto } from './permisionType.dto';

export class PermissionTypeValidator implements PermissionTypeDto {
  @IsNumber()
  id: number;

  @IsEnum(
    [
      'read',
      'profiles approval',
      'create tasks',
      'set keys',
      'resolve conflicts',
      'blog',
      'increase score',
    ],
    { message: 'Некорректное значение для поля name' }
  )
  name: PermissionTypeDto['name'];
}
