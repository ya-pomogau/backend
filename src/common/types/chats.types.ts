import { type ObjectId } from 'mongoose';

export interface MessageInterface {
  _id: ObjectId;
  title: string;
  body: string;
  attach: string[];
  timestamp: number;
  author: ObjectId;
}
export interface ChatInterface {
  _id: ObjectId;
  users: [ObjectId, ObjectId | null];
  messages: MessageInterface;
  isOpen: boolean;
  ownerId: ObjectId;
  taskId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
