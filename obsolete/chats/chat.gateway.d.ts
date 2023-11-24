import { Repository } from 'typeorm';
import { Server } from 'socket.io';
import { Chat } from './entities/chat.entity';
export declare class ChatGateway {
    private chatRepository;
    constructor(chatRepository: Repository<Chat>);
    server: Server;
    private clientTimers;
    handleConnection(client: {
        disconnect: () => void;
        id: string;
    }): void;
    handleMessage(client: {
        disconnect: () => void;
        id: string;
    }, data: {
        chatId: string;
        sender: string;
        text: string;
    }): Promise<void>;
    createChat(): Promise<void>;
}
