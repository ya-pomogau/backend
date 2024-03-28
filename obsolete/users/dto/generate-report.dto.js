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
exports.GenerateReportDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const validation_options_1 = require("../../../src/common/constants/validation-options");
const types_1 = require("../types");
class GenerateReportDto {
}
exports.GenerateReportDto = GenerateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: types_1.ReportStatus.ACTIVE, enum: types_1.ReportStatus }),
    (0, class_validator_1.IsEnum)(types_1.ReportStatus),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "reportStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: types_1.ReportRole.VOLUNTEER, enum: types_1.ReportRole }),
    (0, class_validator_1.IsEnum)(types_1.ReportRole),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "reportRole", void 0);
//# sourceMappingURL=generate-report.dto.js.map