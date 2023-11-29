import { ObjectId } from 'mongodb';
import { UserStatus } from '../../users/types';
export declare class Category {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    points: number;
    accessStatus: UserStatus;
}
