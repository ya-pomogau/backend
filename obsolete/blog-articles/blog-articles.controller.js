"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogArticlesController = void 0;
const fs = require("fs");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const exceptions_1 = require("@nestjs/common/exceptions");
const schedule_1 = require("@nestjs/schedule");
const blog_articles_service_1 = require("./blog-articles.service");
const create_blog_article_dto_1 = require("./dto/create-blog-article.dto");
const update_blog_article_dto_1 = require("./dto/update-blog-article.dto");
const auth_user_decorator_1 = require("../auth/decorators/auth-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const user_roles_guard_1 = require("../auth/guards/user-roles.guard");
const admin_permissions_guard_1 = require("../auth/guards/admin-permissions.guard");
const user_roles_decorator_1 = require("../auth/decorators/user-roles.decorator");
const types_1 = require("../users/types");
const admin_permissions_decorator_1 = require("../auth/decorators/admin-permissions.decorator");
const blog_article_entity_1 = require("./entities/blog-article.entity");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const exceptions_2 = require("../../src/common/constants/exceptions");
const bypass_auth_decorator_1 = require("../auth/decorators/bypass-auth.decorator");
const multer_config_1 = require("../../src/config/multer-config");
const configuration_1 = require("../../src/config/configuration");
const constants_1 = require("../../src/common/constants");
let BlogArticlesController = class BlogArticlesController {
    constructor(blogArticlesService) {
        this.blogArticlesService = blogArticlesService;
    }
    async create(user, createBlogArticleDto) {
        return this.blogArticlesService.create(user._id, createBlogArticleDto);
    }
    async upload(file) {
        try {
            await fs.promises.mkdir(`${file.destination}`, { recursive: true });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return `${(0, configuration_1.default)().server.http_address}/blog-articles/images/${file.filename}`;
    }
    async getImage(id, res) {
        const image = `${(0, configuration_1.default)().blogs.dest}/${id}`;
        return res.sendFile(image);
    }
    async findAll() {
        return this.blogArticlesService.findAll();
    }
    async findOne(id) {
        return this.blogArticlesService.findOne(id);
    }
    async update(id, updateBlogArticleDto) {
        return this.blogArticlesService.update(id, updateBlogArticleDto);
    }
    async deleteImage(id) {
        try {
            console.log(id);
            await fs.promises.unlink(`${(0, configuration_1.default)().blogs.dest}/${id}`);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        const articleToDelete = await this.findOne(id);
        if (!articleToDelete) {
            throw new exceptions_1.NotFoundException(exceptions_2.default.blogArticles.notFound);
        }
        await this.blogArticlesService.remove(id);
        articleToDelete.images.forEach((image) => {
            const id = image.split('/').at(-1);
            this.deleteImage(id);
        });
    }
    async removeUnused() {
        const usedImages = await this.blogArticlesService.findUsedImages();
        const usedFileNames = usedImages.map((image) => image.split('/').at(-1));
        fs.readdir(`${(0, configuration_1.default)().blogs.dest}`, (err, files) => {
            files.forEach(async (file) => {
                const { birthtimeMs } = await fs.promises.stat(`${(0, configuration_1.default)().blogs.dest}/${file}`);
                const now = new Date().getTime();
                if (!usedFileNames.includes(file) && now - birthtimeMs > constants_1.dayInMs) {
                    await this.deleteImage(file);
                }
            });
        });
    }
};
exports.BlogArticlesController = BlogArticlesController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Создание новой статьи в блоге',
        description: 'Доступ только для администраторов',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: blog_article_entity_1.BlogArticle,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_2.default.users.onlyForAdmins,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.ADMIN, types_1.EUserRole.MASTER),
    (0, admin_permissions_decorator_1.AdminPermissions)(types_1.AdminPermission.BLOG),
    (0, common_1.Post)(),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, create_blog_article_dto_1.CreateBlogArticleDto]),
    __metadata("design:returntype", Promise)
], BlogArticlesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Загрузка картинок блога с локального ПК',
        description: 'Для загрузки необходимо передать файл в формате jpg/jpeg/png/gif. Файл будет сохранен в формате jpg.' +
            '<br>Загруженные картинки, которые не были прикреплены к какой-либо статье в течении суток, будут удалены автоматически.',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_2.default.users.onlyForAdmins,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.ADMIN, types_1.EUserRole.MASTER),
    (0, admin_permissions_decorator_1.AdminPermissions)(types_1.AdminPermission.BLOG),
    (0, common_1.Post)('upload-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', (0, multer_config_1.multerOptions)(multer_config_1.uploadType.BLOGS))),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogArticlesController.prototype, "upload", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Получение картинки блога по ссылке',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'id картинки, строка из 24 шестнадцатеричных символов',
        type: String,
    }),
    (0, bypass_auth_decorator_1.BypassAuth)(),
    (0, common_1.Get)('images/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlogArticlesController.prototype, "getImage", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Список статей блога',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: blog_article_entity_1.BlogArticle,
        isArray: true,
    }),
    (0, bypass_auth_decorator_1.BypassAuth)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogArticlesController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Поиск статьи по id',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: blog_article_entity_1.BlogArticle,
    }),
    (0, bypass_auth_decorator_1.BypassAuth)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogArticlesController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Редактирование статьи в блоге',
        description: 'Доступ только для администраторов',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: blog_article_entity_1.BlogArticle,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_2.default.users.onlyForAdmins,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.ADMIN, types_1.EUserRole.MASTER),
    (0, admin_permissions_decorator_1.AdminPermissions)(types_1.AdminPermission.BLOG),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_blog_article_dto_1.UpdateBlogArticleDto]),
    __metadata("design:returntype", Promise)
], BlogArticlesController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Удаление загруженных картинок блога',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_2.default.users.onlyForAdmins,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.ADMIN, types_1.EUserRole.MASTER),
    (0, admin_permissions_decorator_1.AdminPermissions)(types_1.AdminPermission.BLOG),
    (0, common_1.Delete)('images/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogArticlesController.prototype, "deleteImage", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Удаление статьи в блоге',
        description: 'Доступ только для администраторов. При удалении записи автоматически удаляются все загруженные картинки, прикрепленные к данной статье',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: blog_article_entity_1.BlogArticle,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_2.default.users.onlyForAdmins,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.ADMIN, types_1.EUserRole.MASTER),
    (0, admin_permissions_decorator_1.AdminPermissions)(types_1.AdminPermission.BLOG),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogArticlesController.prototype, "remove", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogArticlesController.prototype, "removeUnused", null);
exports.BlogArticlesController = BlogArticlesController = __decorate([
    (0, swagger_1.ApiTags)('Blog-articles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('blog-articles'),
    __metadata("design:paramtypes", [blog_articles_service_1.BlogArticlesService])
], BlogArticlesController);
//# sourceMappingURL=blog-articles.controller.js.map