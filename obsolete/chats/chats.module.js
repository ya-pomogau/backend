"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_gateway_1 = require("./chat.gateway");
const chats_service_1 = require("./chats.service");
const chat_entity_1 = require("./entities/chat.entity");
const chats_controller_1 = require("./chats.controller");
const cronService_1 = require("./cronService");
let ChatsModule = class ChatsModule {
};
exports.ChatsModule = ChatsModule;
exports.ChatsModule = ChatsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([chat_entity_1.Chat])],
        controllers: [chats_controller_1.ChatsController],
        providers: [chat_gateway_1.ChatGateway, chats_service_1.ChatsService, cronService_1.CronService],
    })
], ChatsModule);
//# sourceMappingURL=chats.module.js.map