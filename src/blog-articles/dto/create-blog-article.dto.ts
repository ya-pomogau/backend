import { IsString, IsNotEmpty, MinLength, MaxLength, IsUrl, IsArray } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import validationOptions from '../../common/constants/validation-options';

export class CreateBlogArticleDto {
  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @MinLength(validationOptions.limits.blogArticle.title.min, {
    message: validationOptions.messages.tooShort,
  })
  @MaxLength(validationOptions.limits.blogArticle.title.max, {
    message: validationOptions.messages.tooLong,
  })
  @ApiProperty({ example: 'Благотворительность в рекламе' })
  title: string;

  @IsString({ message: validationOptions.messages.shouldBeString })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @MinLength(validationOptions.limits.blogArticle.text.min, {
    message: validationOptions.messages.tooShort,
  })
  @ApiProperty({
    example:
      'Реклама благотворительности встречается везде: от интернет-сайтов до уличных билбордов...',
  })
  text: string;

  @IsUrl(
    { require_protocol: true },
    {
      each: true,
      message: validationOptions.messages.incorrectUrl,
    }
  )
  @IsArray({ message: validationOptions.messages.shouldBeArray })
  @IsNotEmpty({ message: validationOptions.messages.isEmpty })
  @ApiProperty({
    example: ['https://ihelp.ru/blog-articles/images/5cbf0db0-30ca-468a-951c-376dec651a5c.jpg'],
  })
  images: string[];
}
