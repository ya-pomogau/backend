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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const uuid_1 = require("uuid");
const socket_io_1 = require("socket.io");
const mongodb_1 = require("mongodb");
const swagger_1 = require("@nestjs/swagger");
const chat_entity_1 = require("./entities/chat.entity");
const constants_1 = require("../../src/common/constants");
const exceptions_1 = require("../../src/common/constants/exceptions");
let ChatGateway = class ChatGateway {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
        this.clientTimers = new Map();
    }
    handleConnection(client) {
        const timer = setTimeout(() => {
            client.disconnect();
        }, constants_1.disconnectionChatTime);
        this.clientTimers.set(client.id, timer);
    }
    async handleMessage(client, data) {
        if (!data.chatId) {
            throw new common_1.BadRequestException(exceptions_1.default.chats.noId);
        }
        if (!data.sender) {
            throw new common_1.BadRequestException(exceptions_1.default.chats.noSender);
        }
        if (!data.text) {
            throw new common_1.BadRequestException(exceptions_1.default.chats.isEmpty);
        }
        const timer = this.clientTimers.get(client.id);
        if (timer) {
            clearTimeout(timer);
            const newTimer = setTimeout(() => {
                client.disconnect();
            }, constants_1.disconnectionChatTime);
            this.clientTimers.set(client.id, newTimer);
        }
        const { chatId } = data;
        const chat = await this.chatRepository.findOne({
            where: {
                _id: new mongodb_1.ObjectId(chatId),
            },
        });
        if (chat) {
            const newMessage = {
                id: (0, uuid_1.v4)(),
                sender: data.sender,
                text: data.text,
                timestamp: new Date(),
            };
            if (!chat.messages) {
                chat.messages = [];
            }
            chat.messages.push(newMessage);
            await this.chatRepository.save(chat);
            this.server.emit(`chat.${chat._id}.message`, newMessage);
        }
    }
    async createChat() {
        const chat = this.chatRepository.create({ messages: [] });
        await this.chatRepository.save(chat);
        this.server.emit('chatCreated', chat);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Установка соединения' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Успешное соединение' }),
    (0, websockets_1.SubscribeMessage)('connection'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleConnection", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Отправка сообщения' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Сообщение отправлено' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Некорректные данные' }),
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Создать чат' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Чат создан' }),
    (0, websockets_1.SubscribeMessage)('createChat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "createChat", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, swagger_1.ApiTags)('Chat'),
    (0, websockets_1.WebSocketGateway)({
        namespace: 'chat',
        cors: {
            origin: '*',
        },
    }),
    __param(0, (0, typeorm_2.InjectRepository)(chat_entity_1.Chat)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map