import { PickType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';

export class ChangeAdminPermissionsDto extends PickType(CreateAdminDto, ['permissions']) {}
