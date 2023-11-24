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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const categories_service_1 = require("./categories.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const user_roles_guard_1 = require("../auth/guards/user-roles.guard");
const admin_permissions_guard_1 = require("../auth/guards/admin-permissions.guard");
const user_roles_decorator_1 = require("../auth/decorators/user-roles.decorator");
const types_1 = require("../users/types");
const admin_permissions_decorator_1 = require("../auth/decorators/admin-permissions.decorator");
const category_entity_1 = require("./entities/category.entity");
const exceptions_1 = require("../../src/common/constants/exceptions");
let CategoriesController = class CategoriesController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    async create(createCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }
    async findAll() {
        return this.categoriesService.findAll();
    }
    async findById(id) {
        return this.categoriesService.findById(id);
    }
    async updateCategory(id, updateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Создание новой категории',
        description: 'Доступ только для администраторов с соответствующим статусом.',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: category_entity_1.Category,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForAdmins,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.ADMIN, types_1.EUserRole.MASTER),
    (0, admin_permissions_decorator_1.AdminPermissions)(types_1.AdminPermission.CATEGORIES),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Список всех категорий',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: category_entity_1.Category,
        isArray: true,
    }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Поиск категории по id',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: category_entity_1.Category,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Редактирование категории',
        description: 'Доступ только для администраторов с соответствующим статусом. При обновлении баллов или уровня доступа происходит автоматическое обновление данных полей во всех незакрытых заявках категории.',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: category_entity_1.Category,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForAdmins,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.ADMIN, types_1.EUserRole.MASTER),
    (0, admin_permissions_decorator_1.AdminPermissions)(types_1.AdminPermission.CATEGORIES),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "updateCategory", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map