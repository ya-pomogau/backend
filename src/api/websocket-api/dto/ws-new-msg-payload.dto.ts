import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AnyUserInterface } from '../../../common/types/user.types';
import { NewMessageInterface } from '../../../common/types/chats.types';

export class WSNewMsgCommandPayload implements NewMessageInterface {
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
