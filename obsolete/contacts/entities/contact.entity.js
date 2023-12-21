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
exports.Contact = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const mongodb_1 = require("mongodb");
const swagger_1 = require("@nestjs/swagger");
let Contact = class Contact {
    constructor() {
        this.email = null;
        this.social = null;
    }
};
exports.Contact = Contact;
__decorate([
    (0, swagger_1.ApiResponseProperty)({ type: 'string' }),
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", mongodb_1.ObjectId)
], Contact.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Contact.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Contact.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], Contact.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiResponseProperty)(),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Contact.prototype, "social", void 0);
exports.Contact = Contact = __decorate([
    (0, typeorm_1.Entity)()
], Contact);
//# sourceMappingURL=contact.entity.js.map