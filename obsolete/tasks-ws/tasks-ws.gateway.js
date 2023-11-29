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
exports.TasksWsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("../tasks/entities/task.entity");
const types_1 = require("../tasks/types");
const auth_user_decorator_1 = require("../auth/decorators/auth-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const category_entity_1 = require("../categories/entities/category.entity");
let TasksWsGateway = class TasksWsGateway {
    constructor(taskRepository, categoryRepository) {
        this.taskRepository = taskRepository;
        this.categoryRepository = categoryRepository;
    }
    async sendMessage(data, accessStatus) {
        this.server.emit(`getMessage-access-${accessStatus}`, data);
    }
    async getInitial(user) {
        const accessStatus = user ? user.status : 1;
        const tasks = await this.taskRepository.find({
            where: { status: types_1.TaskStatus.CREATED, accessStatus },
        });
        return tasks;
    }
};
exports.TasksWsGateway = TasksWsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TasksWsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('getMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TasksWsGateway.prototype, "sendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getInitial'),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TasksWsGateway.prototype, "getInitial", null);
exports.TasksWsGateway = TasksWsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], TasksWsGateway);
//# sourceMappingURL=tasks-ws.gateway.js.map