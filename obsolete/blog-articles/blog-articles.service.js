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
exports.BlogArticlesService = void 0;
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const checkValidId_1 = require("../../src/common/helpers/checkValidId");
const blog_article_entity_1 = require("./entities/blog-article.entity");
let BlogArticlesService = class BlogArticlesService {
    constructor(blogArticleRepository) {
        this.blogArticleRepository = blogArticleRepository;
    }
    async create(authorId, createBlogArticleDto) {
        const newArticle = this.blogArticleRepository.create({
            ...createBlogArticleDto,
            authorId: authorId.toString(),
        });
        return this.blogArticleRepository.save(newArticle);
    }
    findAll() {
        return this.blogArticleRepository.find();
    }
    findOne(id) {
        (0, checkValidId_1.default)(id);
        const objectId = new mongodb_1.ObjectId(id);
        return this.blogArticleRepository.findOneBy({ _id: objectId });
    }
    async update(id, updateBlogArticleDto) {
        (0, checkValidId_1.default)(id);
        const objectId = new mongodb_1.ObjectId(id);
        await this.blogArticleRepository.update({ _id: objectId }, updateBlogArticleDto);
        return this.blogArticleRepository.findOneBy({ _id: objectId });
    }
    async remove(id) {
        (0, checkValidId_1.default)(id);
        const objectId = new mongodb_1.ObjectId(id);
        await this.blogArticleRepository.delete(objectId);
    }
    async findUsedImages() {
        const articles = await this.blogArticleRepository.find();
        return [...new Set(articles.flatMap((article) => article.images))];
    }
};
exports.BlogArticlesService = BlogArticlesService;
exports.BlogArticlesService = BlogArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(blog_article_entity_1.BlogArticle)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository])
], BlogArticlesService);
//# sourceMappingURL=blog-articles.service.js.map