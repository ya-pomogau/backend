import { EUserRole } from '../../users/types';
export interface ICallbackQueryDto {
    role?: EUserRole;
    fullname?: string;
    phone?: string;
    address?: string;
    signup?: string;
    error?: string;
    code?: string;
    error_description?: string;
}
export declare class CallbackQueryDto implements ICallbackQueryDto {
    error?: string;
    code?: string;
    error_description?: string;
    fullname?: string;
    role?: EUserRole;
    phone?: string;
    address?: string;
    coordinates?: string;
    signup?: string;
}
