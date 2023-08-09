import { Controller, Get, Post } from '@nestjs/common';
import { Param, Redirect } from '@nestjs/common/decorators';
import { ApiTags } from "@nestjs/swagger";
import { RoutesService } from './routes.service';

@ApiTags('Все роуты')
@Controller('routes')
export class RoutesController {
  constructor(private routesService: RoutesService) { }

  @Get('/')
  unauthorized() {
    return this.routesService.getHello() /* неавторизованные: / */
  }

  @Post('/signin')
  signIn() {
    return this.routesService.signIn() /* логин: /signin */
  }

  @Post('/signup')
  signUp() {
    return this.routesService.signUp() /* чекаут:  /signup */
  }

  @Post('/registration')
  registration() {
    return this.routesService.registration() /* регистрация: /registration */
  }

  @Get('/users')
  allUsers() {
    return this.routesService.getUsers() /* все юзеры: /users */
  }

  @Get('/users/:id')
  userId(@Param('id') id: string) {
    return this.routesService.getUserById(id) /* по айдишнику: /users/{id} */
  }

  @Post('/users/:id')
  userupdate(@Param('id') id: string) {
    return this.routesService.updateUserById(id) /*  */
  }

  @Get('/profile')
  @Redirect('/signin') // Пример редиректа для невозможности доступа без авторизации
  profile() {
    return this.routesService.getProfile() /* личные кабинеты пользаков (редиректы по правам): /profile */
  }

  @Post('/createadmin')
  createAdmin() {
    return this.routesService.createAdmin() /* создание админа: /createadmin */
  }

  @Get('/rules')
  verifyRules() {
    return this.routesService.verifyRules() /* подтверждение прав: /rules */
  }

  @Post('/changeadmin')
  changeAdmin() {
    return this.routesService.changeAdmin() /* управление админами: /changeadmin */
  }

  @Get('/managechats')
  manageChats() {
    return this.routesService.manageChats() /* список чатов у админов: /managechats */
  }

  @Get('/documents')
  privacyPolicy() {
    return this.routesService.privacyPolicy() /* политика конфиденциальности: /documents */
  }

  @Get('/about')
  about() {
    return this.routesService.about() /* контакты: /about */
  }

  @Post('/managetask')
  manageTask() {
    return this.routesService.manageTask() /* создание заявки: /managetask */
  }

  @Get('/managetask')
  getManageTask() {
    return this.routesService.getManageTask() /* редактирование заявки: /managetask */
  }

  @Get('/tasks')
  getActiveTasks() {
    return this.routesService.getActiveTasks() /* активные заявки: /tasks */
  }

  @Post('/complitedtasks')
  getCompletedTasks() {
    return this.routesService.getCompletedTasks() /* завершенные заявки: /complitedtasks */
  }
}