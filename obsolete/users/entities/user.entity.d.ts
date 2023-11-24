import { ObjectId } from 'mongodb';
import { AdminPermission, EUserRole, UserStatus } from '../types';
export declare class User {
    _id: ObjectId;
    fullname: string;
    role: EUserRole;
    vkId?: number;
    vkLink?: string;
    login?: string;
    password?: string;
    status: UserStatus;
    isBlocked: boolean;
    avatar: string;
    phone: string;
    address: string;
    coordinates: number[];
    createdAt: Date;
    updatedAt: Date;
    scores: number;
    permissions?: AdminPermission[];
    completedTasks: number;
    lastActivityDate: Date | null;
}
