import { EDisplay, EResponseType, EScope } from '../types/enums';
import { EUserRole } from '../../users/types';
export interface ILoginVkQueryDto {
    role?: EUserRole;
    display?: EDisplay;
    scope?: EScope;
    responseType?: EResponseType;
}
export declare class LoginVkQueryDto implements ILoginVkQueryDto {
    display?: EDisplay;
    scope?: EScope;
    responseType?: EResponseType;
}
