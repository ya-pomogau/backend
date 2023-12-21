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
exports.CreateTaskDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const validation_options_1 = require("../../../src/common/constants/validation-options");
class CreateTaskDto {
}
exports.CreateTaskDto = CreateTaskDto;
__decorate([
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, class_validator_1.MinLength)(validation_options_1.default.limits.task.title.min, {
        message: validation_options_1.default.messages.tooShort,
    }),
    (0, class_validator_1.MaxLength)(validation_options_1.default.limits.task.title.max, {
        message: validation_options_1.default.messages.tooLong,
    }),
    (0, swagger_1.ApiProperty)({ example: 'Прошу купить свёклу' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, class_validator_1.MinLength)(validation_options_1.default.limits.task.description.min, {
        message: validation_options_1.default.messages.tooShort,
    }),
    (0, class_validator_1.MaxLength)(validation_options_1.default.limits.task.description.max, {
        message: validation_options_1.default.messages.tooLong,
    }),
    (0, swagger_1.ApiProperty)({ example: 'Прошу купить свёклу для борща' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({ example: '64dc866e64be7861efbdec49' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, class_transformer_1.Type)(() => Date),
    (0, swagger_1.ApiProperty)({ example: new Date('2024-01-01'), required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateTaskDto.prototype, "completionDate", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, class_validator_1.MinLength)(validation_options_1.default.limits.address.min, { message: validation_options_1.default.messages.tooShort }),
    (0, class_validator_1.MaxLength)(validation_options_1.default.limits.address.max, { message: validation_options_1.default.messages.tooLong }),
    (0, swagger_1.ApiProperty)({ example: 'Спб, Невский, 100' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: validation_options_1.default.messages.incorrectCoordinates }),
    (0, class_validator_1.IsNumber)({}, { each: true, message: validation_options_1.default.messages.incorrectCoordinates }),
    (0, class_validator_1.ArrayMinSize)(2, { message: validation_options_1.default.messages.incorrectCoordinates }),
    (0, class_validator_1.ArrayMaxSize)(2, { message: validation_options_1.default.messages.incorrectCoordinates }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({ example: [59.932031, 30.355628] }),
    __metadata("design:type", Array)
], CreateTaskDto.prototype, "coordinates", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ example: '64db8efbe754d48c873030dc', required: false }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "recipientId", void 0);
//# sourceMappingURL=create-task.dto.js.map