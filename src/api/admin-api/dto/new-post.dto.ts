import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { BlogPostInterface } from '../../../common/types/blog-post.types';
import { UserProfile } from '../../../common/types/user.types';

export class PostDTO implements BlogPostInterface {
  @ApiProperty()
  author: UserProfile;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  files: string[];
}
