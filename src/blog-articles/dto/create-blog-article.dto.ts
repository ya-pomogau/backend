import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

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
}
