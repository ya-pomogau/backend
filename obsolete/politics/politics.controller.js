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
exports.PoliticsController = void 0;
const common_1 = require("@nestjs/common");
const politics_service_1 = require("./politics.service");
const create_politic_dto_1 = require("./dto/create-politic.dto");
const update_politic_dto_1 = require("./dto/update-politic.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const unauthorized_1 = require("../auth/types/unauthorized");
const exceptions_1 = require("../../src/common/constants/exceptions");
const user_roles_guard_1 = require("../auth/guards/user-roles.guard");
const user_roles_decorator_1 = require("../auth/decorators/user-roles.decorator");
const types_1 = require("../users/types");
const bypass_auth_decorator_1 = require("../auth/decorators/bypass-auth.decorator");
const politic_entity_1 = require("./entities/politic.entity");
let PoliticsController = class PoliticsController {
    constructor(politicsService) {
        this.politicsService = politicsService;
    }
    create(createPoliticDto) {
        return this.politicsService.create(createPoliticDto);
    }
    find() {
        return this.politicsService.find();
    }
    update(updatePoliticDto) {
        return this.politicsService.update(updatePoliticDto);
    }
};
exports.PoliticsController = PoliticsController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Создание политики конфиденциальности',
        description: 'Доступ только для главного администратора. Создается один раз, далее только корректировки через PATCH.',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        type: unauthorized_1.ApiUnauthorized,
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: politic_entity_1.Politic,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: exceptions_1.default.users.onlyForMaster,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.MASTER),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_politic_dto_1.CreatePoliticDto]),
    __metadata("design:returntype", void 0)
], PoliticsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Политика конциденциальности',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: politic_entity_1.Politic,
    }),
    (0, bypass_auth_decorator_1.BypassAuth)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PoliticsController.prototype, "find", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Редактирование политики конфиденциальности',
        description: 'Доступ только для главного администратора.',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        type: unauthorized_1.ApiUnauthorized,
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: politic_entity_1.Politic,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForMaster,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard),
    (0, user_roles_decorator_1.UserRoles)(types_1.EUserRole.MASTER),
    (0, common_1.Patch)(''),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_politic_dto_1.UpdatePoliticDto]),
    __metadata("design:returntype", void 0)
], PoliticsController.prototype, "update", null);
exports.PoliticsController = PoliticsController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Privacy policy'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('politics'),
    __metadata("design:paramtypes", [politics_service_1.PoliticsService])
], PoliticsController);
//# sourceMappingURL=politics.controller.js.map