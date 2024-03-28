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
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const cron = require("node-cron");
const swagger_1 = require("@nestjs/swagger");
const chats_service_1 = require("./chats.service");
let CronService = class CronService {
    constructor(chatsService) {
        this.chatsService = chatsService;
        this.setupCronJobs();
    }
    setupCronJobs() {
        cron.schedule('0 0 * * *', async () => {
            console.log('Running daily chat cleanup task...');
            await this.chatsService.deleteExpiredChats();
        });
    }
};
exports.CronService = CronService;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Настроить задачи Cron' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CronService.prototype, "setupCronJobs", null);
exports.CronService = CronService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chats_service_1.ChatsService])
], CronService);
//# sourceMappingURL=cronService.js.map