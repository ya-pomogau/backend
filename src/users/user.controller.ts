import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { ChangeAdminPermissionsDto } from './dto/change-adminPermissions.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRolesGuard } from '../auth/guards/user-roles.guard';
import { AdminPermissionsGuard } from '../auth/guards/admin-permissions.guard';
import { UserRoles } from '../auth/decorators/user-roles.decorator';
import { AdminPermission, UserRole } from './types';
import { AdminPermissions } from '../auth/decorators/admin-permissions.decorator';
import { AuthUser } from '../auth/decorators/auth-user.decorator';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    status: 200,
    type: User,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<User[]> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      console.error('Ошибка при получении данных пользователей:', error);
      throw new InternalServerErrorException('Произошла ошибка при получении данных пользователей');
    }
  }

  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.MASTER)
  @Post('admin')
  async createAdmin(@Body(new ValidationPipe()) userData: CreateAdminDto): Promise<User> {
    try {
      return await this.userService.createAdmin(userData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    try {
      return await this.userService.createUser(userData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @Get(':own')
  async getOwnUser(@AuthUser() user: User): Promise<User | undefined> {
    try {
      return await this.userService.findUserById(user._id.toString());
    } catch (error) {
      console.error('Ошибка при получении информации о пользователе:', error);
      throw new InternalServerErrorException(
        'Произошла ошибка при получении информации о пользователе'
      );
    }
  }

  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.findUserById(id);
  }

  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.CONFIRMATION)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const objectId = new ObjectId(id);
    await this.userService.deleteUserById(objectId);
  }

  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    try {
      return this.userService.updateOne(id, updateUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.CONFIRMATION)
  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body(new ValidationPipe()) changeStatusDto: ChangeStatusDto
  ): Promise<User> {
    return this.userService.changeStatus(id, changeStatusDto.status);
  }

  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.KEYS)
  @Patch(':id/key')
  async giveKey(@Param('id') id: string): Promise<User> {
    return this.userService.giveKey(id);
  }

  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.MASTER)
  @Patch(':id/admin-permissions')
  async changeAdminPermissions(
    @Param('id') id: string,
    @Body(new ValidationPipe()) changeAdminPermissionsDto: ChangeAdminPermissionsDto
  ): Promise<User> {
    return this.userService.changeAdminPermissions(id, changeAdminPermissionsDto.permissions);
  }

  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.CONFIRMATION)
  @Patch(':id/block')
  async blockUser(@Param('id') id: string): Promise<User> {
    return this.userService.blockUser(id);
  }
}
