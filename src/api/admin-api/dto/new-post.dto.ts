import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { BlogPostInterface } from '../../../common/types/blog-post.types';

export class PostDTO implements BlogPostInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  files: string[];
}
