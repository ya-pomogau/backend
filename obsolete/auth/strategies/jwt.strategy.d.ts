import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../users/user.service';
import type { IJwtUser } from '../types';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private usersService;
    constructor(configService: ConfigService, usersService: UserService);
    validate(jwtPayload: IJwtUser): Promise<{
        accessToken?: string;
        iss?: string;
        sub?: string;
        aud?: string | string[];
        exp?: number;
        nbf?: number;
        iat?: number;
        jti?: string;
        _id: import("bson").ObjectId;
        fullname: string;
        role: import("../../users/types").EUserRole;
        vkId?: number;
        vkLink?: string;
        login?: string;
        password?: string;
        status: import("../../users/types").UserStatus;
        isBlocked: boolean;
        avatar: string;
        phone: string;
        address: string;
        coordinates: number[];
        createdAt: Date;
        updatedAt: Date;
        scores: number;
        permissions?: import("../../users/types").AdminPermission[];
        completedTasks: number;
        lastActivityDate: Date;
    }>;
}
export {};
