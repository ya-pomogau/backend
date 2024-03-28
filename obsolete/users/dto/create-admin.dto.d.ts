import { AdminPermission, EUserRole } from '../types';
export declare class CreateAdminDto {
    fullname: string;
    login: string;
    password: string;
    role: EUserRole;
    avatar: string;
    phone: string;
    address: string;
    coordinates: number[];
    permissions: AdminPermission[];
}
