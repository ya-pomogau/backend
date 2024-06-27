import { type ObjectId } from 'mongoose';
import {
  AdminInterface,
  AnyUserInterface,
  RecipientInterface,
  VolunteerInterface,
} from './user.types';
import { MongooseIdAndTimestampsInterface } from './system.types';

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
  TASK_CHAT: 'TaskChat',
  SYSTEM_CHAT: 'SystemChat',
  CONFLICT_CHAT_WITH_VOLUNTEER: 'ConflictChatWithVolunteer',
  CONFLICT_CHAT_WITH_RECIPIENT: 'ConflictChatWithRecipient',
} as const;

export type ChatType = keyof typeof ChatTypes;

export interface ChatModelInterface {
  type: ChatType;
  isActive: boolean;
}

export interface TaskChatModelInterface {
  taskId: ObjectId;
  volunteer: VolunteerInterface;
  recipient: RecipientInterface;
  volunteerLastReadAt: Date;
  recipientLastReadAt: Date;
}

export interface SystemChatModelInterface {
  user: VolunteerInterface | RecipientInterface;
  admin: AdminInterface;
  userLastReadAt: Date;
  adminLastReadAt: Date;
}

export interface ConflictChatModelInterface {
  taskId: ObjectId;
  opponentChat: ObjectId;
  admin: AdminInterface;
  adminLastReadAt: Date;
}

export interface ConflictChatWithVolunteerModelInterface extends ConflictChatModelInterface {
  volunteer: VolunteerInterface;
  volunteerLastReadAt: Date;
}

export interface ConflictChatWithRecipientModelInterface extends ConflictChatModelInterface {
  recipient: RecipientInterface;
  recipientLastReadAt: Date;
}

export interface TaskChatInterface
  extends ChatModelInterface,
    TaskChatModelInterface,
    MongooseIdAndTimestampsInterface {}

export interface SystemChatInterface
  extends ChatModelInterface,
    SystemChatModelInterface,
    MongooseIdAndTimestampsInterface {}

export interface ConflictChatWithVolunteerInterface
  extends ChatModelInterface,
    ConflictChatWithVolunteerModelInterface,
    MongooseIdAndTimestampsInterface {}

export interface ConflictChatWithRecipientInterface
  extends ChatModelInterface,
    ConflictChatWithRecipientModelInterface,
    MongooseIdAndTimestampsInterface {}
