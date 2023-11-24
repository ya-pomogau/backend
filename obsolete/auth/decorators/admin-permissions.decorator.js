"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPermissions = exports.PERMISSIONS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISSIONS_KEY = 'permissions';
const AdminPermissions = (...adminPermissions) => (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, adminPermissions);
exports.AdminPermissions = AdminPermissions;
//# sourceMappingURL=admin-permissions.decorator.js.map