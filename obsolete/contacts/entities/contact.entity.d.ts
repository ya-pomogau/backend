import { ObjectId } from 'mongodb';
export declare class Contact {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    email: string | null;
    social: string[] | null;
}
