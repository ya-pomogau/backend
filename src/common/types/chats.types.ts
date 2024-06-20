import { type ObjectId } from 'mongoose';
import { AnyUserInterface, RecipientInterface, VolunteerInterface } from './user.types';

export interface MessageInterface {
  _id: ObjectId;
  title: string;
  body: string;
  attaches: string[];
  createdAt: Date;
  author: AnyUserInterface;
  chatId: ObjectId;
}

export const ChatTypes = {
  TASK: 'TASK_CHAT',
  SYSTEM: 'SYSTEM_CHAT',
  CONFLICTVOLUNTEER: 'CONFLICT_CHAT_VOLUNTEER',
  CONFLICTRECIPIENT: 'CONFLICT_CHAT_RECIPIENT',
} as const;

export type ChatType = keyof typeof ChatTypes;

export interface ChatModelInterface {
  _id: ObjectId;
  type: ChatType;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskChatModelInterface {
  taskId: ObjectId;
  volunteer: VolunteerInterface;
  recipient: RecipientInterface;
}

export interface SystemChatModelInterface {
  user: VolunteerInterface | RecipientInterface;
}

export interface ConflictChatWithVolunteerModelInterface {
  taskId: ObjectId;
  volunteer: VolunteerInterface;
  recipientChat: ObjectId;
}

export interface ConflictChatWithRecipientModelInterface {
  taskId: ObjectId;
  recipient: RecipientInterface;
  volunteerChat: ObjectId;
}

export interface TaskChatInterface extends ChatModelInterface, TaskChatModelInterface {}

export interface ConflictChatWithVolunteerInterface
  extends ChatModelInterface,
    ConflictChatWithVolunteerModelInterface {}

export interface ConflictChatWithRecipientInterface
  extends ChatModelInterface,
    ConflictChatWithRecipientModelInterface {}
