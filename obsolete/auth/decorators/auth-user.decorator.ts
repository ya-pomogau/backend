import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

export const AuthUser = createParamDecorator((data: never, ctx: ExecutionContext): User => {
  const request = ctx.switchToHttp().getRequest();

  return request.user;
});
