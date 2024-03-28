"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_task_dto_1 = require("./create-task.dto");
class UpdateTaskDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_task_dto_1.CreateTaskDto, ['recipientId'])) {
}
exports.UpdateTaskDto = UpdateTaskDto;
//# sourceMappingURL=update-task.dto.js.map