import { ObjectId } from 'mongodb';
export interface Message {
    id: string;
    sender: string;
    text: string;
    timestamp: Date;
}
export declare class Chat {
    _id: ObjectId;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}
