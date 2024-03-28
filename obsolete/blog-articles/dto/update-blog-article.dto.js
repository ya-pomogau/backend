"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlogArticleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_blog_article_dto_1 = require("./create-blog-article.dto");
class UpdateBlogArticleDto extends (0, swagger_1.PartialType)(create_blog_article_dto_1.CreateBlogArticleDto) {
}
exports.UpdateBlogArticleDto = UpdateBlogArticleDto;
//# sourceMappingURL=update-blog-article.dto.js.map