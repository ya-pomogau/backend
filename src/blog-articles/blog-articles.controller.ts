import * as fs from 'fs';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  HttpException,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BlogArticlesService } from './blog-articles.service';
import { CreateBlogArticleDto } from './dto/create-blog-article.dto';
import { UpdateBlogArticleDto } from './dto/update-blog-article.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';
import { UserRolesGuard } from '../auth/guards/user-roles.guard';
import { AdminPermissionsGuard } from '../auth/guards/admin-permissions.guard';
import { UserRoles } from '../auth/decorators/user-roles.decorator';
import { AdminPermission, EUserRole } from '../users/types';
import { AdminPermissions } from '../auth/decorators/admin-permissions.decorator';
import { BlogArticle } from './entities/blog-article.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import exceptions from '../common/constants/exceptions';
import { BypassAuth } from '../auth/decorators/bypass-auth.decorator';
import { multerOptions, uploadType } from '../config/multer-config';
import configuration from '../config/configuration';
import { dayInMs } from '../common/constants';

@ApiTags('Blog-articles')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('blog-articles')
export class BlogArticlesController {
  constructor(private readonly blogArticlesService: BlogArticlesService) {}

  @ApiOperation({
    summary: 'Создание новой статьи в блоге',
    description: 'Доступ только для администраторов',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: BlogArticle,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.BLOG)
  @Post()
  async create(@AuthUser() user: User, @Body() createBlogArticleDto: CreateBlogArticleDto) {
    return this.blogArticlesService.create(user._id, createBlogArticleDto);
  }

  @ApiOperation({
    summary: 'Загрузка картинок блога с локального ПК',
    description:
      'Для загрузки необходимо передать файл в формате jpg/jpeg/png/gif. Файл будет сохранен в формате jpg.' +
      '<br>Загруженные картинки, которые не были прикреплены к какой-либо статье в течении суток, будут удалены автоматически.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.BLOG)
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file', multerOptions(uploadType.BLOGS)))
  async upload(@UploadedFile() file) {
    try {
      await fs.promises.mkdir(`${file.destination}`, { recursive: true });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return `${configuration().server.http_address}/blog-articles/images/${file.filename}`;
  }

  @ApiOperation({
    summary: 'Получение картинки блога по ссылке',
  })
  @ApiParam({
    name: 'id',
    description: 'id картинки, строка из 24 шестнадцатеричных символов',
    type: String,
  })
  @BypassAuth()
  @Get('images/:id')
  async getImage(@Param('id') id: string, @Res() res) {
    const image = `${configuration().blogs.dest}/${id}`;
    return res.sendFile(image);
  }

  @ApiOperation({
    summary: 'Список статей блога',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: BlogArticle,
    isArray: true,
  })
  @BypassAuth()
  @Get()
  async findAll() {
    return this.blogArticlesService.findAll();
  }

  @ApiOperation({
    summary: 'Поиск статьи по id',
  })
  @ApiParam({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: BlogArticle,
  })
  @BypassAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.blogArticlesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Редактирование статьи в блоге',
    description: 'Доступ только для администраторов',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: BlogArticle,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.BLOG)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBlogArticleDto: UpdateBlogArticleDto) {
    return this.blogArticlesService.update(id, updateBlogArticleDto);
  }

  @ApiOperation({
    summary: 'Удаление загруженных картинок блога',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.BLOG)
  @Delete('images/:id')
  async deleteImage(@Param('id') id: string) {
    try {
      console.log(id);
      await fs.promises.unlink(`${configuration().blogs.dest}/${id}`);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({
    summary: 'Удаление статьи в блоге',
    description:
      'Доступ только для администраторов. При удалении записи автоматически удаляются все загруженные картинки, прикрепленные к данной статье',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: BlogArticle,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.BLOG)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const articleToDelete = await this.findOne(id);

    if (!articleToDelete) {
      throw new NotFoundException(exceptions.blogArticles.notFound);
    }

    await this.blogArticlesService.remove(id);

    articleToDelete.images.forEach((image) => {
      const id = image.split('/').at(-1);
      this.deleteImage(id);
    });
  }

  // удаление картинок, созданных более суток назад и не прикрепленных к блогу
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeUnused() {
    const usedImages = await this.blogArticlesService.findUsedImages();
    const usedFileNames = usedImages.map((image) => image.split('/').at(-1));
    fs.readdir(`${configuration().blogs.dest}`, (err, files) => {
      files.forEach(async (file) => {
        const { birthtimeMs } = await fs.promises.stat(`${configuration().blogs.dest}/${file}`);
        const now = new Date().getTime();
        if (!usedFileNames.includes(file) && now - birthtimeMs > dayInMs) {
          await this.deleteImage(file);
        }
      });
    });
  }
}
