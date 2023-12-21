"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_config_factory_1 = require("../../src/config/jwt-config.factory");
const hash_module_1 = require("../../src/common/hash/hash.module");
const user_module_1 = require("../users/user.module");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const token_entity_1 = require("./entities/token.entity");
const admin_permissions_guard_1 = require("./guards/admin-permissions.guard");
const user_roles_guard_1 = require("./guards/user-roles.guard");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const local_strategy_1 = require("./strategies/local.strategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            user_module_1.UserModule,
            passport_1.PassportModule,
            hash_module_1.HashModule,
            axios_1.HttpModule,
            jwt_1.JwtModule.registerAsync({
                useClass: jwt_config_factory_1.JwtConfigService,
            }),
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.Token]),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy, user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map