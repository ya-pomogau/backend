"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePoliticDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_politic_dto_1 = require("./create-politic.dto");
class UpdatePoliticDto extends (0, swagger_1.PartialType)(create_politic_dto_1.CreatePoliticDto) {
}
exports.UpdatePoliticDto = UpdatePoliticDto;
//# sourceMappingURL=update-politic.dto.js.map