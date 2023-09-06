import { PickType } from '@nestjs/swagger';
import { CreateAdminDto } from '../../users/dto/create-admin.dto';

export class SigninDto extends PickType(CreateAdminDto, ['login', 'password'] as const) {}
