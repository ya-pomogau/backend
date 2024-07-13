import { CreateUserHandler } from '../../../core/create-user.handler';
import { AuthenticateHandler } from '../../../core/authenticate.handler';
import { LoginUserHandler } from '../../../core/login-user.handler';
import { CheckJwtHandler } from '../../../core/check-jwt.handler';

export const COMMANDS = [CreateUserHandler, AuthenticateHandler, LoginUserHandler, CheckJwtHandler];
