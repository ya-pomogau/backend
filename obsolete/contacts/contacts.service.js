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
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contact_entity_1 = require("./entities/contact.entity");
const exceptions_1 = require("../../src/common/constants/exceptions");
let ContactsService = class ContactsService {
    constructor(contactsRepository) {
        this.contactsRepository = contactsRepository;
    }
    async create(createContactDto) {
        const alreadyCreated = await this.contactsRepository.findOne({});
        if (alreadyCreated) {
            throw new common_1.ForbiddenException(exceptions_1.default.contacts.alreadyCreated);
        }
        const contacts = this.contactsRepository.create(createContactDto);
        return this.contactsRepository.save(contacts);
    }
    async find() {
        return this.contactsRepository.findOne({});
    }
    async update(updateContactDto) {
        const contacts = await this.find();
        return this.contactsRepository.save({ ...contacts, ...updateContactDto });
    }
};
exports.ContactsService = ContactsService;
exports.ContactsService = ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contact_entity_1.Contact)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository])
], ContactsService);
//# sourceMappingURL=contacts.service.js.map