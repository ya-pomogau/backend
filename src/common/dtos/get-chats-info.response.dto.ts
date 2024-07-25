import {
  ChatModelInterface,
  ConflictChatWithRecipientInterface,
  ConflictChatWithVolunteerInterface,
  MessageInterface,
  SystemChatModelInterface,
  TaskChatModelInterface,
} from '../types/chats.types';
import { MongooseIdAndTimestampsInterface } from '../types/system.types';
import { AdminInterface } from '../types/user.types';

export interface WatermarkInterface {
  watermark: string;
  unreads: number;
}

export interface SystemChatMetaInterface
  extends ChatModelInterface,
    Omit<SystemChatModelInterface, 'userLastReadAt' | 'adminLastReadAt'>,
    MongooseIdAndTimestampsInterface,
    WatermarkInterface {}

export interface TaskChatMetaInterface
  extends ChatModelInterface,
    Omit<TaskChatModelInterface, 'volunteerLastReadAt' | 'recipientLastReadAt'>,
    MongooseIdAndTimestampsInterface,
    WatermarkInterface {}

export interface VolunteerConflictChatMetaInterface
  extends ChatModelInterface,
    Pick<ConflictChatWithVolunteerInterface, 'volunteer'>,
    MongooseIdAndTimestampsInterface,
    WatermarkInterface {}
export interface RecipientConflictChatMetaInterface
  extends ChatModelInterface,
    Pick<ConflictChatWithRecipientInterface, 'recipient'>,
    MongooseIdAndTimestampsInterface,
    WatermarkInterface {}

export type VolunteerChatContent = Array<MessageInterface>;
export type RecipientChatContent = Array<MessageInterface>;
export type SystemChatContent = Array<MessageInterface>;
export type TaskChatContent = Array<MessageInterface>;

export type ConflictChatContentTuple = [VolunteerChatContent, RecipientChatContent];

export interface ConflictChatsTupleMetaInterface {
  moderator: AdminInterface | null;
  taskId: string;
  adminVolunteerWatermark: string;
  adminVolunteerUnreads: number;
  adminRecipientWatermark: string;
  adminRecipientUnreads: number;
  meta: [VolunteerConflictChatMetaInterface, RecipientConflictChatMetaInterface];
}

export interface ConflictChatInfo {
  meta: ConflictChatsTupleMetaInterface;
  chats: ConflictChatContentTuple;
}

export interface SystemChatInfo {
  meta: SystemChatMetaInterface;
  chats: SystemChatContent;
}

export interface TaskChatInfo {
  meta: TaskChatMetaInterface;
  chats: TaskChatContent;
}

export interface GetUserChatsResponseDtoInterface {
  task: Array<TaskChatInfo>;
  system: Array<SystemChatInfo>;
  conflict: Array<ConflictChatInfo>;
}

export interface GetAdminChatsResponseDtoInterface {
  my: Array<SystemChatInfo>;
  system: Array<SystemChatInfo>;
  moderated: Array<ConflictChatInfo>;
  conflict: Array<ConflictChatInfo>;
}
