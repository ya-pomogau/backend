import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

export const AuthUser = createParamDecorator((data: never, ctx: ExecutionContext): User => {
  console.log(`auth-user.decorator.ts - 1) ExecutionContext: ${ctx}`);

  const request = ctx.switchToHttp().getRequest();

  console.log(`auth-user.decorator.ts - 2) request, извлеенный их контекста: ${request}`);

  return request.user;
});
