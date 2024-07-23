import { type ObjectId } from 'mongoose';

export interface MessageInterface {
  title: string;
  body: string;
  attach: string[];
  timestamp: number;
  author: ObjectId;
}

export interface ChatInterface {
  users: [ObjectId, ObjectId | null];
  messages: MessageInterface[];
  isOpen: boolean;
  ownerId: ObjectId;
  taskId: ObjectId;
}

export enum ChatType {
  TASK_CHAT = 'TaskChat',
  CONFLICT_CHAT = 'ConflictChat',
  SYSTEM_CHAT = 'SystemChat',
}
