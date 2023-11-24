"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeStatusDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const validation_options_1 = require("../../../src/common/constants/validation-options");
const types_1 = require("../types");
class ChangeStatusDto {
}
exports.ChangeStatusDto = ChangeStatusDto;
__decorate([
    (0, class_validator_1.IsInt)({
        message: validation_options_1.default.messages.shouldBeIntegerNumber,
    }),
    (0, class_validator_1.Min)(validation_options_1.default.limits.userStatus.min, { message: validation_options_1.default.messages.min }),
    (0, class_validator_1.Max)(validation_options_1.default.limits.userStatus.max, { message: validation_options_1.default.messages.max }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({ example: types_1.UserStatus.VERIFIED, enum: types_1.UserStatus }),
    __metadata("design:type", Number)
], ChangeStatusDto.prototype, "status", void 0);
//# sourceMappingURL=change-status.dto.js.map