import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { MethodNotAllowedException } from '@nestjs/common/exceptions';
import { UsersService } from '../../core/users/users.service';
import { NewAdminDto } from './dto/new-admin.dto';
import { UserRole } from '../../common/types/user.types';
import { AccessControlGuard } from '../../common/guards/access-control.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AccessControlList } from '../../common/decorators/access-control-list.decorator';
import { AccessRights } from '../../common/types/access-rights.types';

@UseGuards(JwtAuthGuard)
@UseGuards(AccessControlGuard)
@Controller('admin')
export class AdminApiController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async create(@Body() dto: NewAdminDto) {
    return this.usersService.createAdmin({
      role: UserRole.ADMIN,
      ...dto,
      permissions: [],
      isRoot: false,
    });
  }

  @Put(':id/activate')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async activate(@Param(':id') _id: string) {
    return this.usersService.activate(_id);
  }

  @Delete(':id/activate')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async deactivate(@Param(':id') _id: string) {
    return this.usersService.deactivate(_id);
  }

  @Put('/:id/confirm')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.confirmUser] })
  async confirm(@Param(':id') _id: string) {
    return this.usersService.confirm(_id);
  }

  @Delete('/:id/confirm')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.blockUser] })
  async block(@Param(':id') _id: string) {
    return this.usersService.block(_id);
  }

  @Put('/:id/promote')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.promoteUser] })
  async upgrade(@Param(':id') _id: string) {
    return this.usersService.upgrade(_id);
  }

  @Delete('/:id/promote')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async downgrade(@Param(':id') _id: string) {
    throw new MethodNotAllowedException('Этот метод нельзя использовать здесь!');
    // return this.usersService.downgrade(_id);
  }

  @Put('/:id/keys')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.giveKey] })
  async grantKeys(@Param(':id') _id: string) {
    return this.usersService.grantKeys(_id);
  }

  @Delete('/:id/keys')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async revokeKeys(@Param(':id') _id: string) {
    throw new MethodNotAllowedException('Этот метод нельзя использовать здесь!');
    //  return this.usersService.revokeKeys(_id);
  }
}
