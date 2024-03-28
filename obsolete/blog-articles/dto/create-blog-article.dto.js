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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBlogArticleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const validation_options_1 = require("../../../src/common/constants/validation-options");
class CreateBlogArticleDto {
}
exports.CreateBlogArticleDto = CreateBlogArticleDto;
__decorate([
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, class_validator_1.MinLength)(validation_options_1.default.limits.blogArticle.title.min, {
        message: validation_options_1.default.messages.tooShort,
    }),
    (0, class_validator_1.MaxLength)(validation_options_1.default.limits.blogArticle.title.max, {
        message: validation_options_1.default.messages.tooLong,
    }),
    (0, swagger_1.ApiProperty)({ example: 'Благотворительность в рекламе' }),
    __metadata("design:type", String)
], CreateBlogArticleDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: validation_options_1.default.messages.shouldBeString }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, class_validator_1.MinLength)(validation_options_1.default.limits.blogArticle.text.min, {
        message: validation_options_1.default.messages.tooShort,
    }),
    (0, swagger_1.ApiProperty)({
        example: 'Реклама благотворительности встречается везде: от интернет-сайтов до уличных билбордов...',
    }),
    __metadata("design:type", String)
], CreateBlogArticleDto.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: validation_options_1.default.messages.shouldBeArray }),
    (0, class_validator_1.IsNotEmpty)({ message: validation_options_1.default.messages.isEmpty }),
    (0, swagger_1.ApiProperty)({
        example: ['https://ihelp.ru/blog-articles/images/5cbf0db0-30ca-468a-951c-376dec651a5c.jpg'],
    }),
    __metadata("design:type", Array)
], CreateBlogArticleDto.prototype, "images", void 0);
//# sourceMappingURL=create-blog-article.dto.js.map