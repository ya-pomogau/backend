import { EUserRole } from '../types';
export declare class CreateUserDto {
    fullname: string;
    role: EUserRole;
    vkId: number;
    vkLink: string;
    login: string;
    avatar: string;
    phone: string;
    address: string;
    coordinates: number[];
}
