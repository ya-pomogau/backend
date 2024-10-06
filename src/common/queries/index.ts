import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { GetChatMessagesQueryHandler } from '../../core/get-chat-messages-query.handler';

export const QUERIES_HANDLERS: Type<IQueryHandler>[] = [GetChatMessagesQueryHandler];
