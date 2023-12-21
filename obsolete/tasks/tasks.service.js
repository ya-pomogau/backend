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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const mongodb_1 = require("mongodb");
const exceptions_1 = require("@nestjs/common/exceptions");
const task_entity_1 = require("./entities/task.entity");
const user_entity_1 = require("../users/entities/user.entity");
const exceptions_2 = require("../../src/common/constants/exceptions");
const category_entity_1 = require("../categories/entities/category.entity");
const timeDifference_1 = require("../../src/common/utils/timeDifference");
const types_1 = require("../users/types");
const types_2 = require("./types");
const constants_1 = require("../../src/common/constants");
const queryRunner_1 = require("../../src/common/helpers/queryRunner");
const checkValidId_1 = require("../../src/common/helpers/checkValidId");
let TasksService = class TasksService {
    constructor(taskRepository, userRepository, categoryRepository, dataSource) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.dataSource = dataSource;
    }
    async create(createTaskDto, ownUser) {
        const { recipientId, ...taskInfo } = createTaskDto;
        if ((0, timeDifference_1.default)(new Date(), taskInfo.completionDate) <= 0) {
            throw new common_1.ForbiddenException(exceptions_2.default.tasks.wrongCompletionDate);
        }
        let recipient;
        if (ownUser.role === types_1.EUserRole.RECIPIENT) {
            recipient = ownUser;
        }
        else {
            const recipientObjectId = new mongodb_1.ObjectId(recipientId);
            recipient = await this.userRepository.findOneBy({ _id: recipientObjectId });
            if (!recipient) {
                throw new exceptions_1.NotFoundException(exceptions_2.default.users.notFound);
            }
        }
        const sameTask = await this.taskRepository.findOne({
            where: {
                recipientId: recipient._id.toString(),
                categoryId: createTaskDto.categoryId,
                status: { $in: [types_2.TaskStatus.CREATED, types_2.TaskStatus.ACCEPTED] },
            },
        });
        if (sameTask) {
            throw new common_1.ForbiddenException(exceptions_2.default.tasks.sameTask);
        }
        if (recipient.role !== 'recipient') {
            throw new common_1.ForbiddenException(exceptions_2.default.users.onlyForRecipients);
        }
        if (recipient.status < types_1.UserStatus.CONFIRMED) {
            throw new common_1.ForbiddenException(exceptions_2.default.tasks.wrongStatus);
        }
        const category = await this.categoryRepository.findOneBy({
            _id: new mongodb_1.ObjectId(taskInfo.categoryId),
        });
        if (!category) {
            throw new exceptions_1.NotFoundException(exceptions_2.default.category.notFound);
        }
        const dto = {
            ...taskInfo,
            recipientId: recipient._id.toString(),
            points: category.points,
            accessStatus: category.accessStatus,
        };
        const newTask = this.taskRepository.create(dto);
        await this.userRepository.update({ _id: recipient._id }, { lastActivityDate: new Date() });
        return this.taskRepository.save(newTask);
    }
    async findAll() {
        return this.taskRepository.find();
    }
    async findById(id, user) {
        (0, checkValidId_1.default)(id);
        const objectId = new mongodb_1.ObjectId(id);
        const task = await this.taskRepository.findOneBy({ _id: objectId });
        if (!task) {
            throw new exceptions_1.NotFoundException(exceptions_2.default.tasks.notFound);
        }
        if ((user.role === types_1.EUserRole.RECIPIENT && task.recipientId !== user._id.toString()) ||
            (user.role === types_1.EUserRole.VOLUNTEER &&
                task.volunteerId !== user._id.toString() &&
                task.status !== types_2.TaskStatus.CREATED)) {
            throw new common_1.ForbiddenException(exceptions_2.default.tasks.wrongUser);
        }
        return task;
    }
    async findBy(query) {
        const taskQuery = {};
        Object.keys(query).forEach((property) => {
            taskQuery[property] = { $in: query[property].split(',') };
        });
        const tasks = await this.taskRepository.find({
            where: taskQuery,
        });
        return tasks;
    }
    async findOwn(statuses, user) {
        const statusArray = statuses
            ? statuses.split(',')
            : [types_2.TaskStatus.CREATED, types_2.TaskStatus.ACCEPTED, types_2.TaskStatus.CLOSED];
        if (user.role === types_1.EUserRole.RECIPIENT) {
            return this.taskRepository.find({
                where: { status: { $in: statusArray }, recipientId: user._id.toString() },
            });
        }
        return this.taskRepository.find({
            where: { status: { $in: statusArray }, volunteerId: user._id.toString() },
        });
    }
    async acceptTask(taskId, user) {
        (0, checkValidId_1.default)(taskId);
        const objectTaskId = new mongodb_1.ObjectId(taskId);
        const task = await this.taskRepository.findOneBy({ _id: objectTaskId });
        if (!task) {
            throw new exceptions_1.NotFoundException(exceptions_2.default.tasks.notFound);
        }
        if (task.status !== types_2.TaskStatus.CREATED) {
            throw new common_1.ForbiddenException(exceptions_2.default.tasks.onlyForCreated);
        }
        if (user.role !== types_1.EUserRole.VOLUNTEER) {
            throw new common_1.ForbiddenException(exceptions_2.default.users.onlyForVolunteers);
        }
        const category = await this.categoryRepository.findOneBy({
            _id: new mongodb_1.ObjectId(task.categoryId),
        });
        if (user.status < category.accessStatus) {
            throw new common_1.ForbiddenException(exceptions_2.default.tasks.wrongStatus);
        }
        await this.taskRepository.update({ _id: objectTaskId }, {
            volunteerId: user._id.toString(),
            status: types_2.TaskStatus.ACCEPTED,
            acceptedAt: new Date(),
        });
        await this.userRepository.update({ _id: user._id }, { lastActivityDate: new Date() });
        return this.taskRepository.findOneBy({ _id: objectTaskId });
    }
    async refuseTask(taskId, user) {
        (0, checkValidId_1.default)(taskId);
        const objectTaskId = new mongodb_1.ObjectId(taskId);
        const task = await this.taskRepository.findOneBy({ _id: objectTaskId });
        if (!task) {
            throw new exceptions_1.NotFoundException(exceptions_2.default.tasks.notFound);
        }
        if (task.completionDate &&
            (0, timeDifference_1.default)(new Date(), task.completionDate) < constants_1.dayInMs &&
            user.role === types_1.EUserRole.VOLUNTEER) {
            throw new common_1.ForbiddenException(exceptions_2.default.tasks.noTimeForRefusal);
        }
        if (task.volunteerId !== user._id.toString() && user.role === types_1.EUserRole.VOLUNTEER) {
            throw new common_1.ForbiddenException(exceptions_2.default.tasks.wrongUser);
        }
        await this.taskRepository.update({ _id: objectTaskId }, { volunteerId: null, status: types_2.TaskStatus.CREATED, acceptedAt: null });
        return this.taskRepository.findOneBy({ _id: objectTaskId });
    }
    async removeTask(taskId, user) {
        (0, checkValidId_1.default)(taskId);
        const objectTaskId = new mongodb_1.ObjectId(taskId);
        const task = await this.taskRepository.findOneBy({ _id: objectTaskId });
        if (!task) {
            throw new exceptions_1.NotFoundException(exceptions_2.default.tasks.notFound);
        }
        if (task.recipientId !== user._id.toString() && user.role === types_1.EUserRole.RECIPIENT) {
            throw new common_1.ForbiddenException(exceptions_2.default.tasks.wrongUser);
        }
        if (task.volunteerId && user.role === types_1.EUserRole.RECIPIENT) {
            throw new common_1.ForbiddenException(exceptions_2.default.tasks.cancelForbidden);
        }
        await this.taskRepository.delete(objectTaskId);
        return task;
    }
    async completeTask(task) {
        if (task.status !== types_2.TaskStatus.ACCEPTED) {
            throw new common_1.ForbiddenException(exceptions_2.default.tasks.onlyForAccepted);
        }
        const objectVolunteerId = new mongodb_1.ObjectId(task.volunteerId);
        const volunteer = await this.userRepository.findOneBy({ _id: objectVolunteerId });
        if (!volunteer) {
            throw new exceptions_1.NotFoundException(exceptions_2.default.users.notFound);
        }
        await (0, queryRunner_1.default)(this.dataSource, [
            this.taskRepository.update({ _id: new mongodb_1.ObjectId(task._id) }, { status: types_2.TaskStatus.CLOSED, completed: true, closedAt: new Date() }),
            this.userRepository.update({ _id: objectVolunteerId }, {
                scores: volunteer.scores + task.points,
                completedTasks: volunteer.completedTasks + 1,
                lastActivityDate: new Date(),
            }),
        ]);
        if (volunteer.completedTasks + 1 === constants_1.pointsTo2Status) {
            console.log('Отбивка в чат админу');
        }
        if (volunteer.completedTasks + 1 === constants_1.pointsTo3Status) {
            console.log('Отбивка в чат админу');
        }
    }
    async closeTask(taskId, completed) {
        (0, checkValidId_1.default)(taskId);
        const objectTaskId = new mongodb_1.ObjectId(taskId);
        const task = await this.taskRepository.findOneBy({ _id: objectTaskId });
        if (!task) {
            throw new exceptions_1.NotFoundException(exceptions_2.default.tasks.notFound);
        }
        if (completed) {
            await this.completeTask(task);
        }
        else {
            await this.taskRepository.update({ _id: objectTaskId }, { status: types_2.TaskStatus.CLOSED, completed: false, closedAt: new Date() });
        }
        return this.taskRepository.findOneBy({ _id: objectTaskId });
    }
    async confirmTask(taskId, user, isTaskCompleted) {
        (0, checkValidId_1.default)(taskId);
        const objectTaskId = new mongodb_1.ObjectId(taskId);
        const task = await this.taskRepository.findOneBy({ _id: objectTaskId });
        if (!task) {
            throw new exceptions_1.NotFoundException(exceptions_2.default.tasks.notFound);
        }
        if (task.status !== types_2.TaskStatus.ACCEPTED) {
            throw new common_1.ForbiddenException(exceptions_2.default.tasks.onlyForAccepted);
        }
        if (task.recipientId === user._id.toString()) {
            await this.taskRepository.update({ _id: objectTaskId }, { confirmation: { ...task.confirmation, recipient: isTaskCompleted } });
        }
        else if (task.volunteerId === user._id.toString()) {
            await this.taskRepository.update({ _id: objectTaskId }, { confirmation: { ...task.confirmation, volunteer: isTaskCompleted } });
        }
        else {
            throw new common_1.ForbiddenException(exceptions_2.default.tasks.wrongUser);
        }
        const updatedTask = await this.taskRepository.findOneBy({ _id: objectTaskId });
        if (updatedTask.confirmation.recipient !== null &&
            updatedTask.confirmation.volunteer !== null) {
            if (updatedTask.confirmation.recipient === true &&
                updatedTask.confirmation.volunteer === true) {
                await this.completeTask(updatedTask);
            }
            else if (updatedTask.confirmation.recipient === false &&
                updatedTask.confirmation.volunteer === false) {
                await this.taskRepository.update({ _id: objectTaskId }, { status: types_2.TaskStatus.CLOSED, completed: false });
            }
            else {
                await this.taskRepository.update({ _id: objectTaskId }, { isConflict: true });
                console.log('Вызывайте админа!!!');
            }
        }
        return this.taskRepository.findOneBy({ _id: objectTaskId });
    }
    async update(id, user, updateTaskDto) {
        (0, checkValidId_1.default)(id);
        const objectTaskId = new mongodb_1.ObjectId(id);
        const task = await this.taskRepository.findOneBy({ _id: objectTaskId });
        if (!task) {
            throw new exceptions_1.NotFoundException(exceptions_2.default.tasks.notFound);
        }
        if (task.status !== types_2.TaskStatus.CREATED) {
            throw new common_1.ForbiddenException(exceptions_2.default.tasks.onlyForCreated);
        }
        if (task.recipientId !== user._id.toString() && user.role === types_1.EUserRole.RECIPIENT) {
            throw new common_1.ForbiddenException(exceptions_2.default.tasks.wrongUser);
        }
        await this.taskRepository.update({ _id: objectTaskId }, updateTaskDto);
        return this.taskRepository.findOneBy({ _id: objectTaskId });
    }
    async generateReport({ status, startDate, endDate, check }) {
        const query = {
            [`${status}At`]: {
                $gte: startDate,
                $lt: endDate,
            },
        };
        if (check) {
            query.status = status;
        }
        return this.taskRepository.find({
            where: query,
        });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_2.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_1.MongoRepository,
        typeorm_1.MongoRepository,
        typeorm_1.Repository,
        typeorm_1.DataSource])
], TasksService);
//# sourceMappingURL=tasks.service.js.map