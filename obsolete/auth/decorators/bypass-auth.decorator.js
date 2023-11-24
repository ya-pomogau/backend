"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldBypassAuth = exports.BypassAuth = exports.BYPASS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.BYPASS_KEY = 'bypass';
const BypassAuth = () => {
    return (0, common_1.SetMetadata)(exports.BYPASS_KEY, true);
};
exports.BypassAuth = BypassAuth;
const shouldBypassAuth = (context, reflector) => {
    return reflector.get(exports.BYPASS_KEY, context.getHandler());
};
exports.shouldBypassAuth = shouldBypassAuth;
//# sourceMappingURL=bypass-auth.decorator.js.map