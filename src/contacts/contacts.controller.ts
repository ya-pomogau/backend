import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiUnauthorized } from '../auth/types/unauthorized';
import { HttpStatusCodes } from '../common/constants/httpStatusCodes';
import exceptions from '../common/constants/exceptions';
import { UserRolesGuard } from '../auth/guards/user-roles.guard';
import { EUserRole } from '../users/types';
import { UserRoles } from '../auth/decorators/user-roles.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Contact } from './entities/contact.entity';
import { BypassAuth } from '../auth/decorators/bypass-auth.decorator';

@ApiBearerAuth()
@ApiTags('Contacts')
@UseGuards(JwtGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @ApiOperation({
    summary: 'Создание контактов',
    description:
      'Доступ только для администраторов. Создается один раз, далее только корректировки через PATCH.',
  })
  @ApiUnauthorizedResponse({
    type: ApiUnauthorized,
  })
  @ApiOkResponse({
    status: HttpStatusCodes.OK,
    type: Contact,
  })
  @ApiForbiddenResponse({
    status: HttpStatusCodes.FORBIDDEN,
    description: exceptions.users.onlyForMaster,
  })
  @UseGuards(UserRolesGuard)
  @UserRoles(EUserRole.MASTER)
  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @ApiOperation({
    summary: 'Список контактов',
  })
  @ApiOkResponse({
    status: HttpStatusCodes.OK,
    type: Contact,
  })
  @BypassAuth()
  @Get()
  find() {
    return this.contactsService.find();
  }

  @ApiOperation({
    summary: 'Редактирование контактов',
    description: 'Доступ только для администраторов.',
  })
  @ApiUnauthorizedResponse({
    type: ApiUnauthorized,
  })
  @ApiOkResponse({
    status: HttpStatusCodes.OK,
    type: Contact,
  })
  @ApiForbiddenResponse({
    status: HttpStatusCodes.FORBIDDEN,
    description: exceptions.users.onlyForMaster,
  })
  @UseGuards(UserRolesGuard)
  @UserRoles(EUserRole.MASTER)
  @Patch('')
  update(@Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(updateContactDto);
  }
}
