"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksWsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tasks_ws_gateway_1 = require("./tasks-ws.gateway");
const task_entity_1 = require("../tasks/entities/task.entity");
const category_entity_1 = require("../categories/entities/category.entity");
let TasksWsModule = class TasksWsModule {
};
exports.TasksWsModule = TasksWsModule;
exports.TasksWsModule = TasksWsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([task_entity_1.Task, category_entity_1.Category])],
        providers: [tasks_ws_gateway_1.TasksWsGateway],
        exports: [tasks_ws_gateway_1.TasksWsGateway],
    })
], TasksWsModule);
//# sourceMappingURL=tasks-ws.module.js.map