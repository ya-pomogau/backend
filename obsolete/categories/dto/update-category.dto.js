"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCategoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_category_dto_1 = require("./create-category.dto");
class UpdateCategoryDto extends (0, swagger_1.PartialType)(create_category_dto_1.CreateCategoryDto) {
}
exports.UpdateCategoryDto = UpdateCategoryDto;
//# sourceMappingURL=update-category.dto.js.map