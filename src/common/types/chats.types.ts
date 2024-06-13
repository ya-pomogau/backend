import { type ObjectId } from 'mongoose';
import { AnyUserInterface } from './user.types';

// export interface ChatInterface {
//   _id: ObjectId;
//   users: [ObjectId, ObjectId | null];
//   messages: MessageInterface;
//   isOpen: boolean;
//   ownerId: ObjectId;
//   taskId: ObjectId;
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface MessageInterface {
  _id: ObjectId;
  title: string;
  body: string;
  attaches: string[];
  createdAt: Date;
  author: AnyUserInterface;
  chatId: ObjectId;
}
