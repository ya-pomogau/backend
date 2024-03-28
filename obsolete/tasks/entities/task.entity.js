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
exports.Task = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const mongodb_1 = require("mongodb");
const swagger_1 = require("@nestjs/swagger");
const types_1 = require("../types");
const validation_options_1 = require("../../../src/common/constants/validation-options");
const types_2 = require("../../users/types");
let Task = class Task {
    constructor() {
        this.completionDate = null;
        this.status = types_1.TaskStatus.CREATED;
        this.completed = false;
        this.confirmation = { recipient: null, volunteer: null };
        this.acceptedAt = null;
        this.closedAt = null;
        this.isConflict = false;
    }
};
exports.Task = Task;
__decorate([
    (0, swagger_1.ApiResponseProperty)({ type: 'string' }),
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", mongodb_1.ObjectId)
], Task.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Task.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Task.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(validation_options_1.default.limits.task.title.min, validation_options_1.default.limits.task.title.max),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(validation_options_1.default.limits.task.description.min, validation_options_1.default.limits.task.description.max),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Task.prototype, "completionDate", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Task.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(validation_options_1.default.limits.address.min, validation_options_1.default.limits.address.max),
    __metadata("design:type", String)
], Task.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Array)
], Task.prototype, "coordinates", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "recipientId", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "volunteerId", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], Task.prototype, "points", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Task.prototype, "accessStatus", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Object)
], Task.prototype, "completed", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", types_1.TaskConfirmation)
], Task.prototype, "confirmation", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Task.prototype, "acceptedAt", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Task.prototype, "closedAt", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Object)
], Task.prototype, "isConflict", void 0);
exports.Task = Task = __decorate([
    (0, typeorm_1.Entity)()
], Task);
//# sourceMappingURL=task.entity.js.map