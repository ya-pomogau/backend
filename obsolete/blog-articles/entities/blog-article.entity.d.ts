import { ObjectId } from 'mongodb';
export declare class BlogArticle {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    title: string;
    text: string;
    images: string[];
}
