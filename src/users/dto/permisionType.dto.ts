import { IsString, IsNumber } from 'class-validator';

export class PermissionTypeDto {
  @IsNumber()
  id: number;

  @IsString()
  name:
    | 'read'
    | 'profiles approval'
    | 'create tasks'
    | 'set keys'
    | 'resolve conflicts'
    | 'blog'
    | 'increase score';
}
