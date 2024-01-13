import { SetMetadata } from '@nestjs/common';
import { UserStatus } from '../types/user.types';

export const AccessLevel = (accessLevel: UserStatus) => SetMetadata('level', accessLevel);
