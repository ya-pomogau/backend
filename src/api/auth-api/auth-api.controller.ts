import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  Headers,
  HttpCode,
} from '@nestjs/common';
import { constants } from 'http2';
import { CommandBus /* , QueryBus */ } from '@nestjs/cqrs';
import { VkLoginDto } from './dto/vk-login.dto';
import { AuthService } from '../../core/auth/auth.service';
import { VKNewUserDto } from './dto/vk-new.dto';
import { UsersService } from '../../core/users/users.service';
import { Public } from '../../common/decorators/public.decorator';
import { AdminLoginAuthGuard } from '../../common/guards/local-auth.guard';
import { LoginUserCommand } from '../../common/commands/login-user.command';
import { CreateUserCommand } from '../../common/commands/create-user.command';
import { POJOType } from '../../common/types/pojo.type';
import { User } from '../../datalake/users/schemas/user.schema';
import { AuthenticateCommand } from '../../common/commands/authenticate.command';
import { CheckJwtCommand } from '../../common/commands/check-jwt.command';
import { AnyUserInterface } from '../../common/types/user.types';

const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = constants;

type mockLoginDto = {
  vkId: string;
};

@Controller('auth')
export class AuthApiController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly commandBus: CommandBus //   private readonly queryBus: QueryBus
  ) {}

  @Public()
  @Post('vk')
  @HttpCode(HTTP_STATUS_OK)
  async vkLogin(@Body() dto: VkLoginDto) {
    // return this.authService.loginVK(dto);
    return this.commandBus.execute(new LoginUserCommand(dto));
  }

  @Public()
  @Post('new')
  @HttpCode(HTTP_STATUS_CREATED)
  async register(@Body() dto: VKNewUserDto) {
    const user = await this.commandBus.execute<CreateUserCommand, POJOType<User>>(
      new CreateUserCommand(dto)
    ); // await this.usersService.createUser(dto);
    if (user) {
      const token = await this.commandBus.execute<AuthenticateCommand, string>(
        new AuthenticateCommand(user)
      ); // this.authService.authenticate(user);
      return { token, user };
    }
    throw new InternalServerErrorException('Ошибка создания пользователя');
  }

  @Public()
  @UseGuards(AdminLoginAuthGuard)
  @Post('administrative')
  @HttpCode(HTTP_STATUS_OK)
  async administrative(@Req() req: Express.Request) {
    if (req.user) {
      // TODO: Вынести в сервис в core после решения проблемы с типизацией Users
      const token = await this.commandBus.execute<AuthenticateCommand, string>(
        new AuthenticateCommand(req.user as Record<string, unknown>)
      ); // this.authService.authenticate(req.user as Record<string, unknown>);
      return { token, user: req.user };
    }
    throw new UnauthorizedException('Неверное имя пользователя или пароль');
  }

  @Public()
  @Post('mock')
  @HttpCode(HTTP_STATUS_OK)
  public async mockLogin(@Body() dto: mockLoginDto) {
    const { vkId: mockId } = dto;
    const user = await this.usersService.checkVKCredential(mockId);
    if (user) {
      // TODO: Вынести в сервис в core после решения проблемы с типизацией Users
      const token = await this.authService.authenticate(user as Record<string, unknown>);
      return { token, user };
    }
    throw new UnauthorizedException('Неверное имя пользователя или пароль');
  }

  @Public()
  @Get('token')
  @HttpCode(HTTP_STATUS_OK)
  public async checkToken(@Headers() headers: Record<string, string>) {
    const { authorization } = headers;
    if (!!authorization && authorization.startsWith('Bearer')) {
      const jwt = authorization.slice(7, authorization.length);
      const user = await this.commandBus.execute<CheckJwtCommand, AnyUserInterface>(
        new CheckJwtCommand(jwt)
      ); // this.authService.checkJWT(jwt);
      if (user) {
        return user;
      }
    }
    throw new UnauthorizedException('Токен не подходит');
  }
}
