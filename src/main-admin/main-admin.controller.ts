import { Body, Controller, Get, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateMainAdminDto } from './dto/create-main-admin.dto';
import { MainAdmin } from './main-admin.model';
import { MainAdminService } from './main-admin.service';

@ApiTags('Пользователи')
@Controller('mainAdmin')
export class MainAdminController {
  constructor(private mainAdminService: MainAdminService) { }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({ status: 200, type: MainAdmin })
  @Post()
  authorization(@Body() mainAdminDto: CreateMainAdminDto) {
    return this.mainAdminService.authorization(mainAdminDto);
  }
}