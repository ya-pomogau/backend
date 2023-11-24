import type { Response } from 'express';
import type { User as TUser } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { CallbackQueryDto } from './dto/callback.query.dto';
import { SigninResponseDto } from './dto/signin-response.dto';
import type { IJwtUser } from './types';
import { SignupVkDto } from './dto/signup-vk-dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    loginVk(res: Response): void;
    signupVk(res: Response, signupVkDto: SignupVkDto): void;
    callback(query: CallbackQueryDto): Promise<SigninResponseDto | string>;
    me(user: IJwtUser): Promise<Omit<TUser, "login"> | import("../vk/types").IVkUser>;
    signin(user: TUser): Promise<SigninResponseDto>;
}
