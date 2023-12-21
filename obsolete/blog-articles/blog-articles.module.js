"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogArticlesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const blog_articles_service_1 = require("./blog-articles.service");
const blog_articles_controller_1 = require("./blog-articles.controller");
const blog_article_entity_1 = require("./entities/blog-article.entity");
let BlogArticlesModule = class BlogArticlesModule {
};
exports.BlogArticlesModule = BlogArticlesModule;
exports.BlogArticlesModule = BlogArticlesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([blog_article_entity_1.BlogArticle])],
        controllers: [blog_articles_controller_1.BlogArticlesController],
        providers: [blog_articles_service_1.BlogArticlesService],
    })
], BlogArticlesModule);
//# sourceMappingURL=blog-articles.module.js.map