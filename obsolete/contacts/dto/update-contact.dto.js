"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateContactDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_contact_dto_1 = require("./create-contact.dto");
class UpdateContactDto extends (0, swagger_1.PartialType)(create_contact_dto_1.CreateContactDto) {
}
exports.UpdateContactDto = UpdateContactDto;
//# sourceMappingURL=update-contact.dto.js.map