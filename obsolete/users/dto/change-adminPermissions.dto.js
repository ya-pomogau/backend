"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeAdminPermissionsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_admin_dto_1 = require("./create-admin.dto");
class ChangeAdminPermissionsDto extends (0, swagger_1.PickType)(create_admin_dto_1.CreateAdminDto, ['permissions']) {
}
exports.ChangeAdminPermissionsDto = ChangeAdminPermissionsDto;
//# sourceMappingURL=change-adminPermissions.dto.js.map