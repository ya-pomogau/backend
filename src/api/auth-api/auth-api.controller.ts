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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AnswerAdminOkDto, AnswerOkDto, UserDto } from '../../common/dto/api.dto';
import { VkLoginDto } from './dto/vk-login.dto';
import { AuthService } from '../../core/auth/auth.service';
import { VKNewUserDto } from './dto/vk-new.dto';
import { MockLoginDto } from './dto/vk-mock-login.dto';
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
import { AdminLoginDto } from './dto/admin.dto';

const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = constants;

/* type mockLoginDto = {
  vkId: string;
}; */

@Controller('auth')
export class AuthApiController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly commandBus: CommandBus //   private readonly queryBus: QueryBus
  ) {}

  @Public()
  @Post('vk')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({ type: VkLoginDto })
  @ApiCreatedResponse({
    description: 'Авторизация прошла успешно.',
    type: AnswerOkDto,
  })
  @ApiUnauthorizedResponse({ description: 'Неверное имя пользователя или пароль' })
  @HttpCode(HTTP_STATUS_OK)
  async vkLogin(@Body() dto: VkLoginDto) {
    // return this.authService.loginVK(dto);
    return this.commandBus.execute(new LoginUserCommand(dto));
  }

  @Public()
  @Post('new')
  @HttpCode(HTTP_STATUS_CREATED)
  @ApiOperation({ summary: 'Создает нового пользователя: волонтер или реципиент' })
  @ApiBody({ type: VKNewUserDto })
  @ApiCreatedResponse({
    description: 'Пользователь успешно создан.',
    type: AnswerOkDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Произошла ошибка' })
  @ApiBadRequestResponse({ description: 'Произошла ошибка' })
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
  @ApiOperation({ summary: 'Авторизация администратора' })
  @ApiBody({ type: AdminLoginDto })
  @ApiCreatedResponse({
    description: 'Авторизация прошла успешно.',
    type: AnswerAdminOkDto,
  })
  @ApiUnauthorizedResponse({ description: 'Неверное имя пользователя или пароль' })
  @HttpCode(HTTP_STATUS_OK)
  async administrative(@Req() req: Express.Request) {
    if (req.user) {
      // TODO: Вынести в сервис в core после решения проблемы с типизацией Users
      const token = await this.commandBus.execute<AuthenticateCommand, string>(
        new AuthenticateCommand(req.user as AnyUserInterface)
      ); // this.authService.authenticate(req.user as Record<string, unknown>);
      return { token, user: req.user };
    }
    throw new UnauthorizedException('Неверное имя пользователя или пароль');
  }

  @Public()
  @Post('mock')
  @ApiOperation({ summary: 'Моковая авторизация, используется только для разработки' })
  @ApiBody({ type: MockLoginDto })
  @ApiCreatedResponse({
    description: 'Авторизация прошла успешно.',
    type: AnswerOkDto,
  })
  @ApiBadRequestResponse({ description: 'Произошла ошибка' })
  @ApiUnauthorizedResponse({ description: 'Неверный VKID' })
  @HttpCode(HTTP_STATUS_OK)
  public async mockLogin(@Body() dto: MockLoginDto) {
    const { vkId: mockId } = dto;
    const user = await this.usersService.checkVKCredential(mockId);
    if (user) {
      // TODO: Вынести в сервис в core после решения проблемы с типизацией Users
      const token = await this.authService.authenticate(user);
      return { token, user };
    }
    throw new UnauthorizedException('Неверное имя пользователя или пароль');
  }

  @Public()
  @Get('token')
  @ApiOperation({ summary: 'Проверяет токен' })
  @ApiCreatedResponse({
    description: 'Токен правильный.',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Токен не подходит' })
  @ApiInternalServerErrorResponse({ description: 'Произошла ошибка' })
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
