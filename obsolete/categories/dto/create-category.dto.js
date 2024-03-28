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
exports.CreateCategoryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const validation_options_1 = require("../../../src/common/constants/validation-options");
class CreateCategoryDto {
}
exports.CreateCategoryDto = CreateCategoryDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.MinLength)(validation_options_1.default.limits.categoryTitle.min, {
        message: validation_options_1.default.messages.tooShort,
    }),
    (0, class_validator_1.MaxLength)(validation_options_1.default.limits.categoryTitle.max, {
        message: validation_options_1.default.messages.tooLong,
    }),
    (0, swagger_1.ApiProperty)({ example: 'Покупка продуктов' }),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, class_validator_1.IsInt)({
        message: validation_options_1.default.messages.shouldBeIntegerNumber,
    }),
    (0, class_validator_1.IsPositive)({
        message: validation_options_1.default.messages.shouldBePositiveNumber,
    }),
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], CreateCategoryDto.prototype, "points", void 0);
__decorate([
    (0, class_validator_1.IsInt)({
        message: validation_options_1.default.messages.shouldBeIntegerNumber,
    }),
    (0, class_validator_1.Min)(validation_options_1.default.limits.categoryAccess.min, { message: validation_options_1.default.messages.min }),
    (0, class_validator_1.Max)(validation_options_1.default.limits.categoryAccess.max, { message: validation_options_1.default.messages.max }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], CreateCategoryDto.prototype, "accessStatus", void 0);
//# sourceMappingURL=create-category.dto.js.map