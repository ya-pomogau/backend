import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../../core/users/users.service';
import { NewAdminDto } from './dto/new-admin.dto';
import { UserRole } from '../../common/types/user.types';
import { Public } from '../../common/decorators/public.decorator';
import { AccessControlGuard } from '../../common/guards/access-control.guard';
import { Root } from '../../common/decorators/root.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Role } from '../../common/decorators/roles.decorator';
import { AccessControlList } from '../../common/decorators/access-control-list.decorator';

@UseGuards(JwtAuthGuard)
@UseGuards(AccessControlGuard)
@Controller('admin')
export class AdminApiController {
  constructor(private readonly usersService: UsersService) {}

  @Post('new')
  // @Role(UserRole.ADMIN)
  // @Root()
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async create(@Body() dto: NewAdminDto) {
    return this.usersService.createAdmin({
      role: UserRole.ADMIN,
      ...dto,
      permissions: [],
      isRoot: false,
    });
  }
}
