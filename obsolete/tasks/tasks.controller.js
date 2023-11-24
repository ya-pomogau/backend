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
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tasks_service_1 = require("./tasks.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const user_entity_1 = require("../users/entities/user.entity");
const tasks_ws_gateway_1 = require("../tasks-ws/tasks-ws.gateway");
const types_1 = require("../tasks-ws/types");
const auth_user_decorator_1 = require("../auth/decorators/auth-user.decorator");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const types_2 = require("../users/types");
const user_roles_decorator_1 = require("../auth/decorators/user-roles.decorator");
const user_roles_guard_1 = require("../auth/guards/user-roles.guard");
const admin_permissions_guard_1 = require("../auth/guards/admin-permissions.guard");
const admin_permissions_decorator_1 = require("../auth/decorators/admin-permissions.decorator");
const confirm_task_dto_1 = require("./dto/confirm-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const task_entity_1 = require("./entities/task.entity");
const task_query_dto_1 = require("./dto/task-query.dto");
const exceptions_1 = require("../../src/common/constants/exceptions");
const generate_report_dto_1 = require("./dto/generate-report.dto");
let TasksController = class TasksController {
    constructor(tasksService, tasksGateway) {
        this.tasksService = tasksService;
        this.tasksGateway = tasksGateway;
    }
    async create(createTaskDto, user) {
        const newTask = await this.tasksService.create(createTaskDto, user);
        this.tasksGateway.sendMessage({
            event: types_1.WsTasksEvents.CREATED,
            data: newTask,
        }, newTask.accessStatus);
        return newTask;
    }
    async findBy(query) {
        return this.tasksService.findBy(query);
    }
    async findOwn(status, user) {
        return this.tasksService.findOwn(status, user);
    }
    async generateReport(generateReportDto) {
        return this.tasksService.generateReport(generateReportDto);
    }
    async findAll() {
        return this.tasksService.findAll();
    }
    async findById(id, user) {
        return this.tasksService.findById(id, user);
    }
    async acceptTask(taskId, user) {
        const acceptedTask = await this.tasksService.acceptTask(taskId, user);
        this.tasksGateway.sendMessage({
            event: types_1.WsTasksEvents.ACCEPTED,
            data: acceptedTask,
        }, acceptedTask.accessStatus);
        return acceptedTask;
    }
    async refuseTask(id, user) {
        const refusedTask = await this.tasksService.refuseTask(id, user);
        this.tasksGateway.sendMessage({
            event: types_1.WsTasksEvents.REFUSED,
            data: refusedTask,
        }, refusedTask.accessStatus);
        return refusedTask;
    }
    async deleteTask(id, user) {
        const deletedTask = await this.tasksService.removeTask(id, user);
        this.tasksGateway.sendMessage({
            event: types_1.WsTasksEvents.CLOSED,
            data: deletedTask,
        }, deletedTask.accessStatus);
        return deletedTask;
    }
    async closeTask(id, completed) {
        const closedTask = await this.tasksService.closeTask(id, completed);
        this.tasksGateway.sendMessage({
            event: types_1.WsTasksEvents.CLOSED,
            data: closedTask,
        }, closedTask.accessStatus);
        return closedTask;
    }
    async confirmTask(id, confirmTaskDto, user) {
        return this.tasksService.confirmTask(id, user, confirmTaskDto.completed);
    }
    async update(id, updateTaskDto, user) {
        const updatedTask = await this.tasksService.update(id, user, updateTaskDto);
        this.tasksGateway.sendMessage({
            event: types_1.WsTasksEvents.UPDATED,
            data: updatedTask,
        }, updatedTask.accessStatus);
        return updatedTask;
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Создание новой заявки',
        description: 'При создании заявки реципиентом поле recipientId будет получено из контекста, при создании заявки администратором необходимо указать валидный recipientID. ' +
            '<br >Невозможно создать заявку с recipientId, у которого есть незакрытая заявка в указанной категории.' +
            '<br>Поле points устанавливается согласно категории заявки. При обновлении баллов за категорию во всех незакрытых заявках поле points будет обновлено.' +
            '<br>Поле accessStatus контролирует видимость и возможность принять заявку до волонтеров с соответствующими статусами. Устанавливается согласно категории заявки.',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: task_entity_1.Task,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard),
    (0, user_roles_decorator_1.UserRoles)(types_2.EUserRole.RECIPIENT, types_2.EUserRole.ADMIN, types_2.EUserRole.MASTER),
    (0, admin_permissions_decorator_1.AdminPermissions)(types_2.AdminPermission.TASKS),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Поиск заявок по параметрам',
        description: 'Доступ только для администраторов',
    }),
    (0, swagger_1.ApiQuery)({ type: task_query_dto_1.TaskQueryDto }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: task_entity_1.Task,
        isArray: true,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForAdmins,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard),
    (0, user_roles_decorator_1.UserRoles)(types_2.EUserRole.ADMIN, types_2.EUserRole.MASTER),
    (0, common_1.Get)('find'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findBy", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Список созданных или принятых заявок авторизованного пользователя',
        description: 'Доступ только для волонтеров и реципиентов',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: task_entity_1.Task,
        isArray: true,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: `${exceptions_1.default.users.onlyForVolunteers} ${exceptions_1.default.users.onlyForRecipients}`,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard),
    (0, user_roles_decorator_1.UserRoles)(types_2.EUserRole.RECIPIENT, types_2.EUserRole.VOLUNTEER),
    (0, common_1.Get)('own'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findOwn", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Список заявок для отчета',
        description: 'Доступ только для администраторов',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: task_entity_1.Task,
        isArray: true,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForAdmins,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard),
    (0, user_roles_decorator_1.UserRoles)(types_2.EUserRole.ADMIN, types_2.EUserRole.MASTER),
    (0, common_1.Get)('report'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_report_dto_1.GenerateReportDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "generateReport", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Список всех заявок',
        description: 'Доступ только для администраторов',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: task_entity_1.Task,
        isArray: true,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForAdmins,
    }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard),
    (0, user_roles_decorator_1.UserRoles)(types_2.EUserRole.ADMIN, types_2.EUserRole.MASTER),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Поиск заявки по id',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: task_entity_1.Task,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Отклик на заявку',
        description: 'Доступ только для волонтеров',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: task_entity_1.Task,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForVolunteers,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard),
    (0, user_roles_decorator_1.UserRoles)(types_2.EUserRole.VOLUNTEER),
    (0, common_1.Patch)(':id/accept'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "acceptTask", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Отказ от заявки',
        description: 'Доступ только для волонтеров и администраторов. Волонтер не может отказаться от заявки, до старта которой осталось менее 24 часов. Администратор может отменить отклик в любое время.',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: task_entity_1.Task,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: `${exceptions_1.default.users.onlyForVolunteers} ${exceptions_1.default.users.onlyForAdmins}`,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard),
    (0, user_roles_decorator_1.UserRoles)(types_2.EUserRole.VOLUNTEER, types_2.EUserRole.ADMIN, types_2.EUserRole.MASTER),
    (0, admin_permissions_decorator_1.AdminPermissions)(types_2.AdminPermission.TASKS, types_2.AdminPermission.CONFLICTS),
    (0, common_1.Patch)(':id/refuse'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "refuseTask", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Удаление заявки по id',
        description: 'Доступ только для реципиентов и администраторов. Реципиент может удалить только свою заявку, которую не принял волонтер. Администратор может удалить любую заявку.',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: task_entity_1.Task,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: `${exceptions_1.default.users.onlyForRecipients} ${exceptions_1.default.users.onlyForAdmins}`,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard),
    (0, user_roles_decorator_1.UserRoles)(types_2.EUserRole.RECIPIENT, types_2.EUserRole.ADMIN, types_2.EUserRole.MASTER),
    (0, admin_permissions_decorator_1.AdminPermissions)(types_2.AdminPermission.TASKS),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "deleteTask", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Ручное закрытие заявки',
        description: 'Доступ только для администраторов с соответствующими правами. Если заявка была выполнена, необходимо передать query ?completed=true. Если не была выполнена, query можно не передавать.',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: task_entity_1.Task,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: exceptions_1.default.users.onlyForAdmins,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard),
    (0, user_roles_decorator_1.UserRoles)(types_2.EUserRole.ADMIN, types_2.EUserRole.MASTER),
    (0, admin_permissions_decorator_1.AdminPermissions)(types_2.AdminPermission.TASKS, types_2.AdminPermission.CONFLICTS),
    (0, common_1.Patch)(':id/close'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('completed')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "closeTask", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Подтверждение выполнения заявки',
        description: 'Доступ только для волонтеров и реципиентов, учавствующих в заявке. ' +
            '<br>Каждый участник передает в поле confirmation булевое значение. Если они совпадают, заявка закрывается с соответствующим значение поля completed, волонтер получает/не получает баллы за выполнение.' +
            ' Если не совпадают, администратору приходит отбивка в чат о конфликте - необходимо ручное закрытие.',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: task_entity_1.Task,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: `${exceptions_1.default.users.onlyForRecipients} ${exceptions_1.default.users.onlyForVolunteers}`,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard),
    (0, user_roles_decorator_1.UserRoles)(types_2.EUserRole.RECIPIENT, types_2.EUserRole.VOLUNTEER),
    (0, common_1.Patch)(':id/confirm'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true }))),
    __param(2, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, confirm_task_dto_1.ConfirmTaskDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "confirmTask", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Редактирование заявки по id',
        description: 'Доступ только для реципиентов и администраторов. Нельзя редактировать поле recipientId. Нельзя редактировать принятую волонтером заявку.',
    }),
    (0, swagger_1.ApiOkResponse)({
        status: common_1.HttpStatus.OK,
        type: task_entity_1.Task,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: `${exceptions_1.default.users.onlyForRecipients} ${exceptions_1.default.users.onlyForAdmins}`,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String }),
    (0, common_1.UseGuards)(user_roles_guard_1.UserRolesGuard, admin_permissions_guard_1.AdminPermissionsGuard),
    (0, user_roles_decorator_1.UserRoles)(types_2.EUserRole.RECIPIENT, types_2.EUserRole.ADMIN, types_2.EUserRole.MASTER),
    (0, admin_permissions_decorator_1.AdminPermissions)(types_2.AdminPermission.TASKS, types_2.AdminPermission.CONFLICTS),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true }))),
    __param(2, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_dto_1.UpdateTaskDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Tasks'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService,
        tasks_ws_gateway_1.TasksWsGateway])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map