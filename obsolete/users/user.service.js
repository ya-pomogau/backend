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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const exceptions_1 = require("@nestjs/common/exceptions");
const user_entity_1 = require("./entities/user.entity");
const exceptions_2 = require("../../src/common/constants/exceptions");
const types_1 = require("./types");
const hash_service_1 = require("../../src/common/hash/hash.service");
const constants_1 = require("../../src/common/constants");
const checkValidId_1 = require("../../src/common/helpers/checkValidId");
let UserService = class UserService {
    constructor(usersRepository, hashService) {
        this.usersRepository = usersRepository;
        this.hashService = hashService;
    }
    async findAll() {
        const users = await this.usersRepository.find();
        return users.map((user) => {
            const { login, password, ...rest } = user;
            return rest;
        });
    }
    async findBy(query) {
        const userQuery = {};
        Object.keys(query).forEach((property) => {
            userQuery[property] = { $in: query[property].split(',') };
        });
        const tasks = await this.usersRepository.find({
            where: userQuery,
        });
        return tasks;
    }
    async createUser(createUserDto) {
        if (createUserDto.role === types_1.EUserRole.ADMIN || createUserDto.role === types_1.EUserRole.MASTER) {
            throw new common_1.ForbiddenException(exceptions_2.default.users.userCreating);
        }
        const newUser = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(newUser).catch((e) => {
            console.log(e);
            if (e.code === exceptions_2.default.dbCodes.notUnique) {
                throw new common_1.BadRequestException(exceptions_2.default.users.notUniqueVk);
            }
            return e;
        });
    }
    async createAdmin(createAdminDto) {
        if (createAdminDto.role === types_1.EUserRole.RECIPIENT ||
            createAdminDto.role === types_1.EUserRole.VOLUNTEER) {
            throw new common_1.ForbiddenException(exceptions_2.default.users.adminCreating);
        }
        const hash = await this.hashService.generateHash(createAdminDto.password);
        const newUser = this.usersRepository.create({
            ...createAdminDto,
            password: hash,
            status: types_1.UserStatus.ACTIVATED,
        });
        const user = await this.usersRepository.save(newUser).catch((e) => {
            if (e.code === exceptions_2.default.dbCodes.notUnique) {
                console.log(e);
                throw new common_1.BadRequestException(exceptions_2.default.users.notUniqueLogin);
            }
            return e;
        });
        const { login, password, ...rest } = user;
        return rest;
    }
    async getUserByUsername(fullname) {
        const user = await this.usersRepository.findOneBy({ fullname });
        if (!user) {
            throw new exceptions_1.NotFoundException(exceptions_2.default.users.notFound);
        }
        const { login, password, ...rest } = user;
        return rest;
    }
    async getUserByLogin(login) {
        const user = await this.usersRepository.findOne({ where: { login } });
        return user;
    }
    async getUserByVkId(vkId) {
        const user = await this.usersRepository.findOneBy({ vkId });
        if (!user) {
            throw new exceptions_1.NotFoundException(exceptions_2.default.users.notFound);
        }
        return user;
    }
    async deleteUserById(id) {
        (0, checkValidId_1.default)(id);
        const objectId = new mongodb_1.ObjectId(id);
        await this.usersRepository.delete(objectId);
    }
    async findUserById(id) {
        (0, checkValidId_1.default)(id);
        const _id = new mongodb_1.ObjectId(id);
        const user = await this.usersRepository.findOne({
            where: { _id },
        });
        if (!user) {
            throw new exceptions_1.NotFoundException(exceptions_2.default.users.notFound);
        }
        const { login, password, ...rest } = user;
        return rest;
    }
    async updateOne(id, updateUserDto) {
        const user = await this.findUserById(id);
        if (!user) {
            throw new exceptions_1.NotFoundException(exceptions_2.default.users.notFound);
        }
        return this.usersRepository.save({ ...user, ...updateUserDto });
    }
    async changeStatus(id, status) {
        const user = await this.findUserById(id);
        if (user.role !== types_1.EUserRole.VOLUNTEER &&
            status !== types_1.UserStatus.CONFIRMED &&
            status !== types_1.UserStatus.UNCONFIRMED) {
            throw new common_1.ForbiddenException(exceptions_2.default.users.onlyForVolunteers);
        }
        if (status > 2) {
            throw new common_1.BadRequestException(exceptions_2.default.users.notForKeys);
        }
        await this.usersRepository.update({ _id: new mongodb_1.ObjectId(id) }, { status });
        return this.findUserById(id);
    }
    async giveKey(id) {
        const user = await this.findUserById(id);
        if (user.role !== types_1.EUserRole.VOLUNTEER) {
            throw new common_1.ForbiddenException(exceptions_2.default.users.onlyForVolunteers);
        }
        await this.usersRepository.update({ _id: new mongodb_1.ObjectId(id) }, { status: types_1.UserStatus.ACTIVATED });
        return this.findUserById(id);
    }
    async changeAdminPermissions(id, permissions) {
        const user = await this.findUserById(id);
        if (user.role !== types_1.EUserRole.ADMIN) {
            throw new common_1.ForbiddenException(exceptions_2.default.users.onlyForAdmins);
        }
        await this.usersRepository.update({ _id: new mongodb_1.ObjectId(id) }, { permissions });
        return this.findUserById(id);
    }
    async blockUser(id) {
        const user = await this.findUserById(id);
        await this.usersRepository.update({ _id: new mongodb_1.ObjectId(id) }, { isBlocked: !user.isBlocked });
        return this.findUserById(id);
    }
    async generateReport({ reportStatus, reportRole }) {
        const activityDate = new Date().getTime() - constants_1.daysOfActivityMS;
        if (reportStatus === types_1.ReportStatus.NEW) {
            return this.usersRepository.find({
                where: {
                    status: types_1.UserStatus.CONFIRMED,
                    lastActivityDate: null,
                    role: reportRole,
                },
            });
        }
        if (reportStatus === types_1.ReportStatus.ACTIVE) {
            return this.usersRepository.find({
                where: {
                    lastActivityDate: {
                        $gte: new Date(activityDate),
                    },
                    role: reportRole,
                },
            });
        }
        if (reportStatus === types_1.ReportStatus.INACTIVE) {
            return this.usersRepository.find({
                where: {
                    lastActivityDate: {
                        $lt: new Date(activityDate),
                    },
                    role: reportRole,
                },
            });
        }
        if (reportStatus === types_1.ReportStatus.BLOCKED) {
            return this.usersRepository.find({
                where: {
                    isBlocked: true,
                    role: reportRole,
                },
            });
        }
        return [];
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        hash_service_1.HashService])
], UserService);
//# sourceMappingURL=user.service.js.map