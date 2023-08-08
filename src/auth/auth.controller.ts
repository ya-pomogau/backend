import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";
import { CreateMainAdminDto } from 'src/main-admin/dto/create-main-admin.dto';
import { AuthService } from './auth.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/signinadmin')
  login(@Body() mainAdminDto: CreateMainAdminDto) {
    return this.authService.login(mainAdminDto)
  }
}