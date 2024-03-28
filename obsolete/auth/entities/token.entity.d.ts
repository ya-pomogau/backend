import { ObjectId } from 'typeorm';
import { User } from '../../users/entities/user.entity';
export declare class Token {
    _id: ObjectId;
    token: string;
    expiresIn: number;
    userId: User['_id'];
    constructor(partial?: Partial<Token>);
}
