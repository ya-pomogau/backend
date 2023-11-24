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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const auth_user_decorator_1 = require("./decorators/auth-user.decorator");
const callback_query_dto_1 = require("./dto/callback.query.dto");
const login_vk_query_dto_1 = require("./dto/login-vk.query.dto");
const signin_response_dto_1 = require("./dto/signin-response.dto");
const jwt_guard_1 = require("./guards/jwt.guard");
const local_guard_1 = require("./guards/local.guard");
const unauthorized_1 = require("./types/unauthorized");
const signup_vk_dto_1 = require("./dto/signup-vk-dto");
const signin_dto_1 = require("./dto/signin.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    loginVk(res) {
        return res
            .status(common_1.HttpStatus.MOVED_PERMANENTLY)
            .redirect(this.authService.getRedirectUrl(false));
    }
    signupVk(res, signupVkDto) {
        return res
            .status(common_1.HttpStatus.MOVED_PERMANENTLY)
            .redirect(this.authService.getRedirectUrl(true, signupVkDto));
    }
    async callback(query) {
        if (!query.code) {
            if (query.error && query.error_description) {
                return `Ошибка авторизации: ${query.error}, ${query.error_description}`;
            }
            return 'Неправильный код авторизации';
        }
        let signupVkDto = null;
        if (query.signup) {
            signupVkDto = {
                fullname: query.fullname,
                role: query.role,
                address: query.address,
                phone: query.phone,
                coordinates: query.coordinates,
            };
        }
        try {
            return await this.authService.getAccessToken(query.code, signupVkDto, !!query.signup);
        }
        catch (err) {
            return `Произошла ошибка при получении access_token: ${err.message}`;
        }
    }
    async me(user) {
        if ('accessToken' in user) {
            return this.authService.getUserVK(user.accessToken);
        }
        return this.authService.getUserMongo(user._id.toString());
    }
    async signin(user) {
        return this.authService.auth(user);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Авторизация для реципиента/волонтера',
        description: 'Авторизация существуюшего в базе реципиента/волонтера через вконтакте.',
    }),
    (0, swagger_1.ApiQuery)({
        type: login_vk_query_dto_1.LoginVkQueryDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.MOVED_PERMANENTLY,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        type: unauthorized_1.ApiUnauthorized,
    }),
    (0, common_1.Get)('signin-vk'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginVk", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Регистрация для реципиента/волонтера',
        description: 'Пользователи создаются со статусом 0 (минимальный). Невозможна повторная регистрация по существующему в базе id вконтакте.',
    }),
    (0, swagger_1.ApiBody)({
        type: signup_vk_dto_1.SignupVkDto,
        description: 'Поле coordinates (только) для этой ручки должно быть в формате строки.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.MOVED_PERMANENTLY,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        type: unauthorized_1.ApiUnauthorized,
    }),
    (0, common_1.Post)('signup-vk'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, signup_vk_dto_1.SignupVkDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signupVk", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Ответ от вконтакте при успешной авторизации/регистрации',
        description: 'Активируется при ответе от вконтаке. Все поля заполняются автоматически.',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: signin_response_dto_1.SigninResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        type: unauthorized_1.ApiUnauthorized,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        schema: {
            type: 'string',
            example: 'Ошибка авторизации',
        },
    }),
    (0, common_1.Get)('callback'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [callback_query_dto_1.CallbackQueryDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "callback", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Данные о пользователе, полученные от вконтакте',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({
        type: unauthorized_1.ApiUnauthorized,
    }),
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Авторизация для администратора' }),
    (0, swagger_1.ApiBody)({
        type: signin_dto_1.SigninDto,
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: signin_response_dto_1.SigninResponseDto,
    }),
    (0, common_1.UseGuards)(local_guard_1.LocalGuard),
    (0, common_1.Post)('signin-admin'),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signin", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map