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
exports.CreatePoliticDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const validation_options_1 = require("../../../src/common/constants/validation-options");
class CreatePoliticDto {
}
exports.CreatePoliticDto = CreatePoliticDto;
__decorate([
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({ example: 'Политика конфиденциальности' }),
    __metadata("design:type", String)
], CreatePoliticDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({
        example: '<h2>1. Общие положения</h2> <p>Настоящая политика обработки персональных данных составлена в соответствии с требованиями Федерального закона...</p>',
    }),
    __metadata("design:type", String)
], CreatePoliticDto.prototype, "text", void 0);
//# sourceMappingURL=create-politic.dto.js.map