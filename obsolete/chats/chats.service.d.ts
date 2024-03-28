import { MongoRepository } from 'typeorm';
import { Chat } from './entities/chat.entity';
export declare class ChatsService {
    private chatRepository;
    constructor(chatRepository: MongoRepository<Chat>);
    createChat(): Promise<Chat>;
    getChatById(id: string): Promise<Chat | undefined>;
    deleteExpiredChats(): Promise<void>;
    deleteMessage(chatId: string, messageId: string): Promise<void>;
}
