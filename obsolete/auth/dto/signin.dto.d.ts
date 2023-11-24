import { CreateAdminDto } from '../../users/dto/create-admin.dto';
declare const SigninDto_base: import("@nestjs/common").Type<Pick<CreateAdminDto, "login" | "password">>;
export declare class SigninDto extends SigninDto_base {
}
export {};
