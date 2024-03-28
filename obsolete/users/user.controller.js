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
exports.UserController = void 0;
const fs = require("fs");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const user_entity_1 = require("./entities/user.entity");
const user_service_1 = require("./user.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const change_status_dto_1 = require("./dto/change-status.dto");
const change_adminPermissions_dto_1 = require("./dto/change-adminPermissions.dto");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const create_user_dto_1 = require("./dto/create-user.dto");
const user_roles_guard_1 = require("../auth/guards/user-roles.guard");
const admin_permissions_guard_1 = require("../auth/guards/admin-permissions.guard");
const user_roles_decorator_1 = require("../auth/decorators/user-roles.decorator");
const types_1 = require("./types");
const admin_permissions_decorator_1 = require("../auth/decorators/admin-permissions.decorator");
const auth_user_decorator_1 = require("../auth/decorators/auth-user.decorator");
const unauthorized_1 = require("../auth/types/unauthorized");
const exceptions_1 = require("../../src/common/constants/exceptions");
const task_entity_1 = require("../tasks/entities/task.entity");
const user_query_dto_1 = require("./dto/user-query.dto");
const generate_report_dto_1 = require("./dto/generate-report.dto");
const bypass_auth_decorator_1 = require("../auth/decorators/bypass-auth.decorator");
const multer_config_1 = require("../../src/config/multer-config");
const configuration_1 = require("../../src/config/configuration");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async createAdmin(userData) {
        try {
            return await this.userService.createAdmin(userData);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createUser(userData) {
        try {
            return await this.userService.createUser(userData);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findBy(query) {
        return this.userService.findBy(query);
    }
    async getAvatar(id, res) {
        const image = `${(0, configuration_1.default)().avatars.dest}/${id}-avatar.jpg`;
        return res.sendFile(image);
    }
    async getOwnUser(user) {
        try {
            return await this.userService.findUserById(user._id.toString());
        }
        catch (error) {
            console.error('Ошибка при получении информации о пользователе:', error);
            throw new common_1.InternalServerErrorException('Произошла ошибка при получении информации о пользователе');
        }
    }
    async generateReport(generateReportDto) {
        return this.userService.generateReport(generateReportDto);
    }
    async findAll() {
        try {
            return await this.userService.findAll();
        }
        catch (error) {
            console.error('Ошибка при получении данных пользователей:', error);
            throw new common_1.InternalServerErrorException('Произошла ошибка при получении данных пользователей');
        }
    }
    async getUserById(id) {
        return this.userService.findUserById(id);
    }
    async deleteUser(id) {
        await this.userService.deleteUserById(id);
    }
    async upload(user, file) {
        try {
            await fs.promises.mkdir(`${file.destination}`, { recursive: true });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const userPath = `${file.destination}/${user._id}-avatar.jpg`;
        try {
            await fs.rename(file.path, userPath, function (err) {
                if (err) {
                    return console.error(err);
                }
                return null;
            });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return this.userService.updateOne(user._id.toString(), {
            avatar: `${(0, configuration_1.default)().server.http_address}/users/${user._id.toString()}/avatar`,
        });
    }
    async updateUser(id, updateUserDto) {
        try {
            return this.userService.updateOne(id, updateUserDto);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async changeStatus(id, changeStatusDto) {
        return this.userService.changeStatus(id, changeStatusDto.status);
    }
    async giveKey(id) {
        return this.userService.giveKey(id);
    }
    async changeAdminPermissions(id, changeAdminPermissionsDto) {
        return this.userService.changeAdminPermissions(id, changeAdminPermissionsDto.permissions);
    }
    async blockUser(id) {
        return this.userService.blockUser(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Создание администратора',
        description: 'Доступ только для главного администратора. Администраторы создаются со статусом 3 (максимальный). Права устанавливаются в массиве permissions - все доступные перечислены в примере.',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        type: unauthorized_1.ApiUnauthorized,
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForMaster,
    }),
    (0, bypass_auth_decorator_1.BypassAuth)(),
    (0, common_1.Post)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createAdmin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Создание реципиента/волонтера (только для тестов, в проде регистрация через вк!)',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: user_entity_1.User,
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Поиск пользователей по параметрам',
        description: 'Доступ только для администраторов',
    }),
    (0, swagger_1.ApiQuery)({ type: user_query_dto_1.UserQueryDto }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: task_entity_1.Task,
        isArray: true,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForAdmins,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.ADMIN, types_1.EUserRole.MASTER),
    (0, common_1.Get)('find'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findBy", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Получение загруженного аватара по ссылке',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'id пользователя, строка из 24 шестнадцатеричных символов',
        type: String,
    }),
    (0, bypass_auth_decorator_1.BypassAuth)(),
    (0, common_1.Get)(':id/avatar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAvatar", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Данные о текущем авторизованном пользователе',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: user_entity_1.User,
    }),
    (0, common_1.Get)('own'),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getOwnUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Список пользователей для отчета',
        description: 'Доступ только для администраторов' +
            '<br> Отсчет дняй активности ведётся от текущих даты и ВРЕМЕНИ минус 30 суток',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: user_entity_1.User,
        isArray: true,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForAdmins,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.ADMIN, types_1.EUserRole.MASTER),
    (0, common_1.Get)('report'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_report_dto_1.GenerateReportDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "generateReport", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Список всех пользователей',
        description: 'Доступ только для администраторов',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: user_entity_1.User,
        isArray: true,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForAdmins,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.ADMIN, types_1.EUserRole.MASTER),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Поиск пользователя по id',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Удаление пользователя по id',
        description: 'Доступ только для администраторов с соответствующими правами',
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForAdmins,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.ADMIN, types_1.EUserRole.MASTER),
    (0, admin_permissions_decorator_1.AdminPermissions)(types_1.AdminPermission.CONFIRMATION),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Загрузка аватара с локального ПК',
        description: 'Для загрузки необходимо передать файл в формате jpg/jpeg/png/gif. Файл будет сохранен в формате jpg.',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: user_entity_1.User,
    }),
    (0, common_1.Patch)('upload-avatar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', (0, multer_config_1.multerOptions)(multer_config_1.uploadType.AVATARS))),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "upload", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Редактирование пользователя по id',
        description: 'Для редактирования доступны только поля, заполняемые при регистрации + аватар',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Изменение статуса пользователя 0 до 2',
        description: 'Доступ только для администраторов с соответствующими правами. Доступные статусы: 0 - не подтвержден, 1 - подтвержден, 2 - подтвержден и проверен. Увеличение статуса до 3 (активирован ключ) доступно только по пути /key.',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForAdmins,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.ADMIN, types_1.EUserRole.MASTER),
    (0, admin_permissions_decorator_1.AdminPermissions)(types_1.AdminPermission.CONFIRMATION),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_status_dto_1.ChangeStatusDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Изменение статуса пользователя до 3 (активирован ключ)',
        description: 'Доступ только для администраторов с соответствующими правами. Для изменения статусов от 0 до 2 используйте путь /status.',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForAdmins,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.ADMIN, types_1.EUserRole.MASTER),
    (0, admin_permissions_decorator_1.AdminPermissions)(types_1.AdminPermission.KEYS),
    (0, common_1.Patch)(':id/key'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "giveKey", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Редактирование прав администраторов',
        description: 'Доступ только для главного администратора. Необходимо передать полный массив обновленных прав.',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForMaster,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.MASTER),
    (0, common_1.Patch)(':id/admin-permissions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_adminPermissions_dto_1.ChangeAdminPermissionsDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeAdminPermissions", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Блокировка/разблокировка пользователя',
        description: 'Доступ только для администраторов с соответствующими правами',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForAdmins,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.ADMIN, types_1.EUserRole.MASTER),
    (0, admin_permissions_decorator_1.AdminPermissions)(types_1.AdminPermission.CONFIRMATION),
    (0, common_1.Patch)(':id/block'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "blockUser", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map