import { ObjectId } from 'mongodb';
import { TaskConfirmation, TaskStatus } from '../types';
import { UserStatus } from '../../users/types';
export declare class Task {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    completionDate: Date | null;
    categoryId: string;
    address: string;
    coordinates: [number, number];
    recipientId: string;
    volunteerId?: string;
    points: number;
    accessStatus: UserStatus;
    status: TaskStatus;
    completed: boolean;
    confirmation: TaskConfirmation;
    acceptedAt: Date | null;
    closedAt: Date | null;
    isConflict: boolean;
}
