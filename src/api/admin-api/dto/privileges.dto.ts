import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { AdminPermission } from '../../../common/types/user.types';

export class ApiPrivilegesDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsIn(
    [
      AdminPermission.CONFLICTS,
      AdminPermission.CATEGORIES,
      AdminPermission.KEYS,
      AdminPermission.BLOG,
      AdminPermission.TASKS,
      AdminPermission.CONFIRMATION,
    ],
    { each: true }
  )
  privileges: Array<AdminPermission>;
}
