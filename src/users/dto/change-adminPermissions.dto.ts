import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { AdminPermission } from '../types';
import validationOptions from '../../common/constants/validation-options';

export class ChangeAdminPermissionsDto {
  @IsArray({ message: validationOptions.messages.incorrectAdminPermissions })
  @IsEnum(AdminPermission, {
    each: true,
    message: validationOptions.messages.strictValues + Object.values(AdminPermission).join(', '),
  })
  @ArrayMinSize(validationOptions.limits.adminPermissions.min, {
    message: validationOptions.messages.incorrectAdminPermissions,
  })
  @ArrayMaxSize(validationOptions.limits.adminPermissions.max, {
    message: validationOptions.messages.incorrectAdminPermissions,
  })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  permissions: AdminPermission[];
}
