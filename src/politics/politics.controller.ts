import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus} from '@nestjs/common';
import { PoliticsService } from './politics.service';
import { CreatePoliticDto } from './dto/create-politic.dto';
import { UpdatePoliticDto } from './dto/update-politic.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {JwtGuard} from "../auth/guards/jwt.guard";
import {ApiUnauthorized} from "../auth/types/unauthorized";
import {Contact} from "../contacts/entities/contact.entity";
import exceptions from "../common/constants/exceptions";
import {UserRolesGuard} from "../auth/guards/user-roles.guard";
import {UserRoles} from "../auth/decorators/user-roles.decorator";
import {EUserRole} from "../users/types";
import {CreateContactDto} from "../contacts/dto/create-contact.dto";
import {BypassAuth} from "../auth/decorators/bypass-auth.decorator";
import {UpdateContactDto} from "../contacts/dto/update-contact.dto";
import {Politic} from "./entities/politic.entity";

@ApiBearerAuth()
@ApiTags('Privacy policy')
@UseGuards(JwtGuard)
@Controller('politics')
export class PoliticsController {
  constructor(private readonly politicsService: PoliticsService) {}

  @ApiOperation({
    summary: 'Создание политики конфиденциальности',
    description:
        'Доступ только для главного администратора. Создается один раз, далее только корректировки через PATCH.',
  })
  @ApiUnauthorizedResponse({
    type: ApiUnauthorized,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: Politic,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.BAD_REQUEST,
    description: exceptions.users.onlyForMaster,
  })
  @UseGuards(UserRolesGuard)
  @UserRoles(EUserRole.MASTER)
  @Post()
  create(@Body() createPoliticDto: CreatePoliticDto) {
    return this.politicsService.create(createPoliticDto);
  }

  @ApiOperation({
    summary: 'Политика конциденциальности',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: Politic,
  })
  @BypassAuth()
  @Get()
  find() {
    return this.politicsService.find();
  }

  @ApiOperation({
    summary: 'Редактирование политики конфиденциальности',
    description: 'Доступ только для главного администратора.',
  })
  @ApiUnauthorizedResponse({
    type: ApiUnauthorized,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: Politic,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: exceptions.users.onlyForMaster,
  })
  @UseGuards(UserRolesGuard)
  @UserRoles(EUserRole.MASTER)
  @Patch('')
  update(@Body() updatePoliticDto: UpdatePoliticDto) {
    return this.politicsService.update(updatePoliticDto);
  }
}
