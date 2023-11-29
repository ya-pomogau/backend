import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { HashService } from '../../src/common/hash/hash.service';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { IVkUser } from '../vk/types';
import { Token } from './entities/token.entity';
import { SignupVkDto } from './dto/signup-vk-dto';
export declare class AuthService {
    private readonly config;
    private readonly httpService;
    private readonly userService;
    private readonly jwtService;
    private readonly hashService;
    private readonly tokenRepository;
    constructor(config: ConfigService, httpService: HttpService, userService: UserService, jwtService: JwtService, hashService: HashService, tokenRepository: Repository<Token>);
    _getRedirectUri(redirectUri: string): string;
    getRedirectUrl(isSignup: boolean, signupDto?: SignupVkDto): string;
    getVkInfo(code: string, signupVkDto: SignupVkDto, isSignup: boolean): Promise<{
        expiresIn: number;
        accessToken: string;
        userId: number;
    }>;
    signupViaVk(vkUser: IVkUser, signupVkDto: SignupVkDto): Promise<User>;
    getAccessToken(code: string, signupVkDto: SignupVkDto | null, isSignup: boolean): Promise<{
        access_token: string;
        user: User;
    }>;
    getUserVK(accessToken: string): Promise<IVkUser>;
    getUserMongo(userId: string): Promise<Omit<User, "login">>;
    auth(user: User): {
        access_token: string;
        user: User;
    };
    validatePassword(login: string, password: string): Promise<User | null>;
}
