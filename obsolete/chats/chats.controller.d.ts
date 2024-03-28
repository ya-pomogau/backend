import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
export declare class ChatsController {
    private chatsService;
    constructor(chatsService: ChatsService);
    createChat(): Promise<Chat>;
    getChat(id: string): Promise<Chat | undefined>;
    deleteExpiredChats(): Promise<{
        message: string;
        error?: undefined;
    } | {
        error: string;
        message?: undefined;
    }>;
    deleteMessage(chatId: string, messageId: string): Promise<void>;
}
