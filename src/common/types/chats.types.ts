import { type ObjectId } from 'mongoose';
import { AnyUserInterface, RecipientInterface, VolunteerInterface } from './user.types';
import { chats } from '../constants/chats';

export interface MessageInterface {
  _id: ObjectId;
  title: string;
  body: string;
  attaches: string[];
  createdAt: Date;
  author: AnyUserInterface;
  chatId: ObjectId;
}

export type ChatType = keyof typeof chats;

export interface ChatModelInterface {
  _id: ObjectId;
  type: ChatType;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskChatModelInterface {
  volunteer: VolunteerInterface;
  recipient: RecipientInterface;
}

export interface SystemChatModelInterface {
  user: VolunteerInterface | RecipientInterface;
}

export interface ConflictWithVolunteerChatModelInterface {
  taskId: ObjectId;
  volunteer: VolunteerInterface;
  recipient: RecipientInterface;
}

export interface ConflictWithRecipientChatModelInterface {
  taskId: ObjectId;
  recipient: RecipientInterface;
  volunteerChat: ObjectId;
}

export interface TaskChatInterface extends ChatModelInterface, TaskChatModelInterface {}

export interface ConflictWithVolunteerChatInterface
  extends ChatModelInterface,
    ConflictWithVolunteerChatModelInterface {}

export interface ConflictWithRecipientChatInterface
  extends ChatModelInterface,
    ConflictWithRecipientChatModelInterface {}
