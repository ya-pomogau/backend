"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigninDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_admin_dto_1 = require("../../users/dto/create-admin.dto");
class SigninDto extends (0, swagger_1.PickType)(create_admin_dto_1.CreateAdminDto, ['login', 'password']) {
}
exports.SigninDto = SigninDto;
//# sourceMappingURL=signin.dto.js.map