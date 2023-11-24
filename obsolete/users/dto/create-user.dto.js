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
exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const types_1 = require("../types");
const validation_options_1 = require("../../../src/common/constants/validation-options");
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, class_validator_1.MinLength)(validation_options_1.default.limits.userName.min, {
        message: validation_options_1.default.messages.tooShort,
    }),
    (0, class_validator_1.MaxLength)(validation_options_1.default.limits.userName.max, {
        message: validation_options_1.default.messages.tooLong,
    }),
    (0, swagger_1.ApiProperty)({ example: 'Георгий' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fullname", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(types_1.EUserRole, {
        message: validation_options_1.default.messages.strictValues + Object.values(types_1.EUserRole).join(', '),
    }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({ example: 'recipient' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: validation_options_1.default.messages.shouldBePositiveNumber }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "vkId", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_protocol: true }, { message: validation_options_1.default.messages.incorrectUrl }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({ example: 'https://vk.com/gosha-recipient' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "vkLink", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "login", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_protocol: true }, { message: validation_options_1.default.messages.incorrectUrl }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({
        example: 'https://webpulse.imgsmail.ru/imgpreview?key=pulse_cabinet-image-88e86878-e1f3-4876-8597-91e4d4bd44fc&mb=webpulse',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "avatar", void 0);
__decorate([
    (0, class_validator_1.IsPhoneNumber)('RU', { message: validation_options_1.default.messages.incorrectPhoneNumber }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({ example: '89213322232' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, class_validator_1.MinLength)(validation_options_1.default.limits.address.min, { message: validation_options_1.default.messages.tooShort }),
    (0, class_validator_1.MaxLength)(validation_options_1.default.limits.address.max, { message: validation_options_1.default.messages.tooLong }),
    (0, swagger_1.ApiProperty)({ example: 'Спб, Невский, 100' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: validation_options_1.default.messages.incorrectCoordinates }),
    (0, class_validator_1.IsNumber)({}, { each: true, message: validation_options_1.default.messages.incorrectCoordinates }),
    (0, class_validator_1.ArrayMinSize)(2, { message: validation_options_1.default.messages.incorrectCoordinates }),
    (0, class_validator_1.ArrayMaxSize)(2, { message: validation_options_1.default.messages.incorrectCoordinates }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({ example: [59.932031, 30.355628] }),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "coordinates", void 0);
//# sourceMappingURL=create-user.dto.js.map