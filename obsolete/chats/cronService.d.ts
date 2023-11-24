import { ChatsService } from './chats.service';
export declare class CronService {
    private readonly chatsService;
    constructor(chatsService: ChatsService);
    private setupCronJobs;
}
