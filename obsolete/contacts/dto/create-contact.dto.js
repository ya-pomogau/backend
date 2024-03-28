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
exports.CreateContactDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const validation_options_1 = require("../../../src/common/constants/validation-options");
class CreateContactDto {
}
exports.CreateContactDto = CreateContactDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: validation_options_1.default.messages.shouldBeEmail }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({ example: 'www@yandex.ru' }),
    __metadata("design:type", String)
], CreateContactDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_protocol: true }, {
        each: true,
        message: validation_options_1.default.messages.incorrectUrl,
    }),
    (0, class_validator_1.IsArray)({ message: validation_options_1.default.messages.shouldBeArray }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({ example: ['https://vk.com/me2help'] }),
    __metadata("design:type", Array)
], CreateContactDto.prototype, "social", void 0);
//# sourceMappingURL=create-contact.dto.js.map