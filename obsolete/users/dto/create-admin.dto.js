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
exports.CreateAdminDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const validation_options_1 = require("../../../src/common/constants/validation-options");
const types_1 = require("../types");
class CreateAdminDto {
}
exports.CreateAdminDto = CreateAdminDto;
__decorate([
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, class_validator_1.MinLength)(validation_options_1.default.limits.userName.min, {
        message: validation_options_1.default.messages.tooShort,
    }),
    (0, class_validator_1.MaxLength)(validation_options_1.default.limits.userName.max, {
        message: validation_options_1.default.messages.tooLong,
    }),
    (0, swagger_1.ApiProperty)({ example: 'Василий' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "fullname", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, class_validator_1.MinLength)(validation_options_1.default.limits.login.min, {
        message: validation_options_1.default.messages.tooShort,
    }),
    (0, class_validator_1.MaxLength)(validation_options_1.default.limits.login.max, {
        message: validation_options_1.default.messages.tooLong,
    }),
    (0, swagger_1.ApiProperty)({ example: 'vasya' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "login", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({ example: 'vasya123' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(types_1.EUserRole, {
        message: validation_options_1.default.messages.strictValues + Object.values(types_1.EUserRole).join(', '),
    }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({ example: 'admin' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_protocol: true }, { message: validation_options_1.default.messages.incorrectUrl }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'https://w.forfun.com/fetch/aa/aaa5465c1c0026e54fa9dc7f8d35c3a9.jpeg',
        required: false,
    }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "avatar", void 0);
__decorate([
    (0, class_validator_1.IsPhoneNumber)('RU', { message: validation_options_1.default.messages.incorrectPhoneNumber }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({ example: '89217776655' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, class_validator_1.MinLength)(validation_options_1.default.limits.address.min, { message: validation_options_1.default.messages.tooShort }),
    (0, class_validator_1.MaxLength)(validation_options_1.default.limits.address.max, { message: validation_options_1.default.messages.tooLong }),
    (0, swagger_1.ApiProperty)({ example: 'СПб, Марата, 4' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: validation_options_1.default.messages.incorrectCoordinates }),
    (0, class_validator_1.IsNumber)({}, { each: true, message: validation_options_1.default.messages.incorrectCoordinates }),
    (0, class_validator_1.ArrayMinSize)(2, { message: validation_options_1.default.messages.incorrectCoordinates }),
    (0, class_validator_1.ArrayMaxSize)(2, { message: validation_options_1.default.messages.incorrectCoordinates }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({ example: [59.930895, 30.355601] }),
    __metadata("design:type", Array)
], CreateAdminDto.prototype, "coordinates", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: validation_options_1.default.messages.incorrectAdminPermissions }),
    (0, class_validator_1.IsEnum)(types_1.AdminPermission, {
        each: true,
        message: validation_options_1.default.messages.strictValues + Object.values(types_1.AdminPermission).join(', '),
    }),
    (0, class_validator_1.ArrayMinSize)(validation_options_1.default.limits.adminPermissions.min, {
        message: validation_options_1.default.messages.incorrectAdminPermissions,
    }),
    (0, class_validator_1.ArrayMaxSize)(validation_options_1.default.limits.adminPermissions.max, {
        message: validation_options_1.default.messages.incorrectAdminPermissions,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({
        example: [
            'create tasks',
            'confirm users',
            'give keys',
            'resolve conflicts',
            'write the blog',
            'change categories',
        ],
    }),
    __metadata("design:type", Array)
], CreateAdminDto.prototype, "permissions", void 0);
//# sourceMappingURL=create-admin.dto.js.map