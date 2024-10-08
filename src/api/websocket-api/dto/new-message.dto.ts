import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AnyUserInterface } from '../../../common/types/user.types';
import { MessageInterface } from '../../../common/types/chats.types';

export class newMessageDto implements Omit<MessageInterface, '_id' | 'createdAt'> {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty()
  attaches: string[];

  @ApiProperty()
  @IsNotEmpty()
  author: AnyUserInterface;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  chatId: string;
}
