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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chats_service_1 = require("./chats.service");
const chat_entity_1 = require("./entities/chat.entity");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
let ChatsController = class ChatsController {
    constructor(chatsService) {
        this.chatsService = chatsService;
    }
    async createChat() {
        return this.chatsService.createChat();
    }
    async getChat(id) {
        return this.chatsService.getChatById(id);
    }
    async deleteExpiredChats() {
        try {
            await this.chatsService.deleteExpiredChats();
            return { message: 'Истекшие чаты успешно удалены' };
        }
        catch (error) {
            console.error('Error deleting expired chats:', error);
            return { error: 'Произошла ошибка при удалении истекших чатов' };
        }
    }
    async deleteMessage(chatId, messageId) {
        await this.chatsService.deleteMessage(chatId, messageId);
    }
};
exports.ChatsController = ChatsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Создание чата' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, type: chat_entity_1.Chat }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "createChat", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Поиск чата по id' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Чат найден', type: chat_entity_1.Chat }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Чат не найден' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "getChat", null);
__decorate([
    (0, common_1.Delete)('deleteExpiredChats'),
    (0, swagger_1.ApiOperation)({ summary: 'Удаление истекших чатов' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Истекшие чаты успешно удалены',
        type: Object,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Произошла ошибка при удалении истекших чатов',
        type: Object,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "deleteExpiredChats", null);
__decorate([
    (0, common_1.Delete)(':chatId/messages/:messageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Удаление сообщения из чата' }),
    (0, swagger_1.ApiParam)({
        name: 'chatId',
        description: 'строка из 24 шестнадцатеричных символов',
        type: String,
    }),
    (0, swagger_1.ApiParam)({
        name: 'messageId',
        description: 'строка из 24 шестнадцатеричных символов',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Сообщение успешно удалено' }),
    __param(0, (0, common_1.Param)('chatId')),
    __param(1, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "deleteMessage", null);
exports.ChatsController = ChatsController = __decorate([
    (0, common_1.Controller)('chats'),
    (0, swagger_1.ApiTags)('Chats'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [chats_service_1.ChatsService])
], ChatsController);
//# sourceMappingURL=chats.controller.js.map