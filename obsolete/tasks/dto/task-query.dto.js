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
exports.TaskQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const types_1 = require("../types");
class TaskQueryDto {
}
exports.TaskQueryDto = TaskQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: types_1.TaskStatus.ACCEPTED, required: false, enum: types_1.TaskStatus }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TaskQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64dc866e64be7861efbdec49d,64dc86b164be7861efbdec4a', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TaskQueryDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64db8efbe754d48c873030dc', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TaskQueryDto.prototype, "recipientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64dbbda56f684bcb8dc7f5b8', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TaskQueryDto.prototype, "volunteerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], TaskQueryDto.prototype, "completed", void 0);
//# sourceMappingURL=task-query.dto.js.map