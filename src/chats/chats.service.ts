import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';

 

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
    ) { }

    private allUsers: { userName: string; registrationToken: string }[] = [];
    private connectedUsers: string[] = [];

    async getChats(): Promise<Chat[]> {
        return await this.chatRepository.find();
    }

    async saveChat(chat: Chat): Promise<void> {
        await this.chatRepository.save(chat);
    }

    userConnected(userName: string, registrationToken: string) {
        const userIndex = this.allUsers.findIndex(u => u.userName === userName);

        if (userIndex === -1) {
            this.allUsers.push({ userName, registrationToken });
        } else {
            this.allUsers[userIndex].registrationToken = registrationToken;
        }

        this.connectedUsers.push(userName);
        console.log("All Users", this.allUsers);
        console.log("Connected Users", this.connectedUsers);
    }

    userDisconnected(userName: string) {
        const userIndex = this.connectedUsers.indexOf(userName);
        if (userIndex !== -1) {
            this.connectedUsers.splice(userIndex, 1);
        }
        console.log("All Users", this.allUsers);
        console.log("Connected Users", this.connectedUsers);
    }

    async sendMessagesToOfflineUsers(chat: Chat) {
        const messagePayload = {
            data: {
                type: "CHAT",
                title: 'chat',
                message: chat.message,
                sender: chat.sender,
                recipient: chat.recipient,
                time: chat.time
            },
            tokens: []
        };

        const userTokens = this.allUsers
            .filter(user => !this.connectedUsers.includes(user.userName))
            .map(user => user.registrationToken);

        if (userTokens.length === 0) {
            return;
        }

        messagePayload.tokens = userTokens;
        /* try {
            await defaultApp.messaging().sendMulticast(messagePayload);
        } catch (ex) {
            console.log(JSON.stringify(ex));
        } */
    }
}
