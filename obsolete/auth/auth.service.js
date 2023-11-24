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
exports.AuthService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exceptions_1 = require("../../src/common/constants/exceptions");
const hash_service_1 = require("../../src/common/hash/hash.service");
const user_service_1 = require("../users/user.service");
const users_1 = require("../vk/users");
const token_entity_1 = require("./entities/token.entity");
let AuthService = class AuthService {
    constructor(config, httpService, userService, jwtService, hashService, tokenRepository) {
        this.config = config;
        this.httpService = httpService;
        this.userService = userService;
        this.jwtService = jwtService;
        this.hashService = hashService;
        this.tokenRepository = tokenRepository;
    }
    _getRedirectUri(redirectUri) {
        const uri = new URL(redirectUri);
        return uri.toString();
    }
    getRedirectUrl(isSignup, signupDto) {
        const { appId, apiOauth } = this.config.get('vk');
        let { redirectUri } = this.config.get('vk');
        const url = new URL(`${apiOauth}/authorize`);
        if (isSignup) {
            redirectUri += `?signup=1&fullname=${signupDto.fullname}&role=${signupDto.role}&address=${signupDto.address}&coordinates=${signupDto.coordinates}&phone=${signupDto.phone}`;
        }
        url.searchParams.set('client_id', appId);
        url.searchParams.append('redirect_uri', this._getRedirectUri(redirectUri));
        return url.toString();
    }
    async getVkInfo(code, signupVkDto, isSignup) {
        const { appId, appSecret, apiOauth } = this.config.get('vk');
        let { redirectUri } = this.config.get('vk');
        const url = new URL(`${apiOauth}/access_token`);
        if (isSignup) {
            redirectUri += `?signup=1&fullname=${signupVkDto.fullname}&role=${signupVkDto.role}&address=${signupVkDto.address}&coordinates=${signupVkDto.coordinates}&phone=${signupVkDto.phone}`;
        }
        url.searchParams.set('client_id', appId);
        url.searchParams.append('client_secret', appSecret);
        url.searchParams.append('redirect_uri', this._getRedirectUri(redirectUri));
        url.searchParams.append('code', code);
        const response = await this.httpService.axiosRef.get(url.toString());
        const { access_token: accessToken, user_id: userId, expires_in: expiresIn } = response.data;
        return { accessToken, userId, expiresIn };
    }
    async signupViaVk(vkUser, signupVkDto) {
        return this.userService.createUser({
            vkId: vkUser.id,
            avatar: vkUser.photo_max,
            vkLink: `https://vk.com/${vkUser.domain}`,
            login: String(vkUser.id),
            ...signupVkDto,
            coordinates: signupVkDto.coordinates.split(',').map((str) => +str),
        });
    }
    async getAccessToken(code, signupVkDto, isSignup) {
        const { accessToken, userId, expiresIn } = await this.getVkInfo(code, signupVkDto, isSignup);
        if (isSignup) {
            const vkUser = await this.getUserVK(accessToken);
            try {
                await this.signupViaVk(vkUser, signupVkDto);
            }
            catch (error) {
                throw new common_1.InternalServerErrorException('Ошибка при попытке регистрации пользователя');
            }
        }
        const user = await this.userService.getUserByVkId(userId);
        const newToken = new token_entity_1.Token({
            token: accessToken,
            expiresIn: Number(expiresIn),
            userId: user._id,
        });
        await this.tokenRepository.save(newToken);
        return {
            access_token: await this.jwtService.signAsync({
                sub: user._id,
                accessToken,
            }, {
                expiresIn,
            }),
            user,
        };
    }
    async getUserVK(accessToken) {
        const usersApi = new users_1.VkApiUsers(this.httpService, accessToken);
        const { response } = await usersApi.get([
            "bdate",
            "has_photo",
            "photo_max",
            "has_mobile",
            "home_town",
            "sex",
            "domain",
        ]);
        const [user] = response;
        return user;
    }
    getUserMongo(userId) {
        return this.userService.findUserById(userId);
    }
    auth(user) {
        const payload = { sub: user._id };
        return { access_token: this.jwtService.sign(payload), user };
    }
    async validatePassword(login, password) {
        const user = await this.userService.getUserByLogin(login);
        if (!user) {
            throw new common_1.UnauthorizedException(exceptions_1.default.auth.wrongLoginOrPassword);
        }
        const isAuthorized = await this.hashService.compareHash(password, user.password);
        if (!isAuthorized) {
            throw new common_1.UnauthorizedException(exceptions_1.default.auth.wrongLoginOrPassword);
        }
        return isAuthorized ? user : null;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, typeorm_1.InjectRepository)(token_entity_1.Token)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService,
        user_service_1.UserService,
        jwt_1.JwtService,
        hash_service_1.HashService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map