import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class SigninDto extends PickType(CreateUserDto, ['login', 'password'] as const) {}
