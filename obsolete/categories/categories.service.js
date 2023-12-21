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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const category_entity_1 = require("./entities/category.entity");
const exceptions_1 = require("../../src/common/constants/exceptions");
const queryRunner_1 = require("../../src/common/helpers/queryRunner");
const task_entity_1 = require("../tasks/entities/task.entity");
const types_1 = require("../tasks/types");
const checkValidId_1 = require("../../src/common/helpers/checkValidId");
let CategoriesService = class CategoriesService {
    constructor(categoryRepository, taskRepository, dataSource) {
        this.categoryRepository = categoryRepository;
        this.taskRepository = taskRepository;
        this.dataSource = dataSource;
    }
    async create(createCategoryDto) {
        const newCategory = this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(newCategory);
    }
    async findAll() {
        return this.categoryRepository.find();
    }
    async findById(id) {
        (0, checkValidId_1.default)(id);
        const objectId = new mongodb_1.ObjectId(id);
        const category = await this.categoryRepository.findOneBy({ _id: objectId });
        if (!category) {
            throw new common_1.NotFoundException(exceptions_1.default.category.notFound);
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        (0, checkValidId_1.default)(id);
        const objectId = new mongodb_1.ObjectId(id);
        const category = await this.categoryRepository.findOneBy({ _id: objectId });
        if (!category) {
            throw new common_1.NotFoundException(exceptions_1.default.category.notFound);
        }
        if (updateCategoryDto.points) {
            await (0, queryRunner_1.default)(this.dataSource, [
                this.categoryRepository.update({ _id: objectId }, updateCategoryDto),
                this.taskRepository.update({ categoryId: id, status: (0, typeorm_2.Not)(types_1.TaskStatus.CLOSED) }, { points: updateCategoryDto.points }),
            ]);
        }
        else {
            await this.categoryRepository.update({ _id: objectId }, updateCategoryDto);
        }
        if (updateCategoryDto.accessStatus) {
            await (0, queryRunner_1.default)(this.dataSource, [
                this.categoryRepository.update({ _id: objectId }, updateCategoryDto),
                this.taskRepository.update({ categoryId: id, status: (0, typeorm_2.Not)(types_1.TaskStatus.CLOSED) }, { points: updateCategoryDto.accessStatus }),
            ]);
        }
        else {
            await this.categoryRepository.update({ _id: objectId }, updateCategoryDto);
        }
        return this.categoryRepository.findOneBy({ _id: objectId });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map