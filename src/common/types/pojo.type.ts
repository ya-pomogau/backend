import { Document } from 'mongoose';

export type POJOType<T extends Document> = ReturnType<T['toObject']>;
