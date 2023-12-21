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
exports.User = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const mongodb_1 = require("mongodb");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const types_1 = require("../types");
const validation_options_1 = require("../../../src/common/constants/validation-options");
let User = class User {
    constructor() {
        this.status = types_1.UserStatus.UNCONFIRMED;
        this.isBlocked = false;
        this.scores = 0;
        this.completedTasks = 0;
        this.lastActivityDate = null;
    }
};
exports.User = User;
__decorate([
    (0, swagger_1.ApiResponseProperty)({ type: 'string' }),
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", mongodb_1.ObjectId)
], User.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(validation_options_1.default.limits.userName.min, validation_options_1.default.limits.userName.max),
    __metadata("design:type", String)
], User.prototype, "fullname", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], User.prototype, "vkId", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsUrl)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], User.prototype, "vkLink", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Index)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "login", void 0);
__decorate([
    (0, typeorm_1.Column)({ select: false }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Number)
], User.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Object)
], User.prototype, "isBlocked", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Array)
], User.prototype, "coordinates", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.CreateDateColumn)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.UpdateDateColumn)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Object)
], User.prototype, "scores", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], User.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Object)
], User.prototype, "completedTasks", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], User.prototype, "lastActivityDate", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.entity.js.map