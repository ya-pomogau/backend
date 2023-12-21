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
exports.PoliticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const politic_entity_1 = require("./entities/politic.entity");
const typeorm_2 = require("typeorm");
const exceptions_1 = require("../../src/common/constants/exceptions");
let PoliticsService = class PoliticsService {
    constructor(politicRepository) {
        this.politicRepository = politicRepository;
    }
    async create(createPoliticDto) {
        const alreadyCreated = await this.politicRepository.findOne({});
        if (alreadyCreated) {
            throw new common_1.ForbiddenException(exceptions_1.default.politic.alreadyCreated);
        }
        const politic = this.politicRepository.create(createPoliticDto);
        return this.politicRepository.save(politic);
    }
    async find() {
        return this.politicRepository.findOne({});
    }
    async update(updatePoliticDto) {
        const politic = await this.find();
        return this.politicRepository.save({ ...politic, ...updatePoliticDto });
    }
};
exports.PoliticsService = PoliticsService;
exports.PoliticsService = PoliticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(politic_entity_1.Politic)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository])
], PoliticsService);
//# sourceMappingURL=politics.service.js.map