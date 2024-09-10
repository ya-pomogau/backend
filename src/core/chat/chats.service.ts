import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';

import { ConflictChatsTupleMetaInterface,
  MessageInterface,
  SystemChatMetaInterface,
  TaskChatMetaInterface
} from 'src/common/types/chats.types';
import { UserRole, UserStatus } from 'src/common/types/user.types';
import { wsChatPageQueryPayload, wsMessageData } from 'src/common/types/websockets.types';


//#region Mock data
const mockObjectId = new ObjectId().toHexString();

const mockMessages: MessageInterface[] = [
  {
    _id: mockObjectId as any,
    title: 'TestTitle1',
    body: 'TestBody1',
    attaches: ['Hi there!', 'Hi there!'],
    createdAt: new Date(),
    author: {
      _id: 'volunteerId',
      role: UserRole.VOLUNTEER,
      name: 'Volunteer',
      phone: 'phone',
      avatar: 'avatar',
      address: 'address',
      vkId: 'vkId',
      score: 0,
      status: UserStatus.BLOCKED,
      location: undefined,
      keys: false,
      tasksCompleted: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      permissions: [],
      login: 'login',
      password: 'password',
      isRoot: false,
      isActive: false,
    },
    chatId: mockObjectId as any,
  },
  {
    _id: mockObjectId as any,
    title: 'TestTitle2',
    body: 'TestBody2',
    attaches: ['Hi there!', 'Hi there!'],
    createdAt: new Date(),
    author: {
      _id: 'volunteerId',
      role: UserRole.VOLUNTEER,
      name: 'Volunteer',
      phone: 'phone',
      avatar: 'avatar',
      address: 'address',
      vkId: 'vkId',
      score: 0,
      status: UserStatus.BLOCKED,
      location: undefined,
      keys: false,
      tasksCompleted: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      permissions: [],
      login: 'login',
      password: 'password',
      isRoot: false,
      isActive: false,
    },
    chatId: mockObjectId as any,
  },
]

const mockResponseMessage: wsMessageData = {
  data: {
    messages: mockMessages
  }
}
//#endregion

@Injectable()
export class ChatService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async createTaskChat(metadata: TaskChatMetaInterface): Promise<wsMessageData> {
    // const chatEntity = new ChatEntity();

    // const newChat = await chatEntity.createChat('TASK_CHAT', metadata);
    // const chatMessages = await newChat.loadMessages([newChat.chatId], 0, 0);

    // const response: wsMessage = {
    //   kind: 'CHAT_PAGE_CONTENT',
    //   payload: {
    //     messages: chatMessages
    //   }
    // }

    // return response;

    console.log('Creating task chat');
    return mockResponseMessage;
  }

  async createSystemChat(metadata: SystemChatMetaInterface): Promise<wsMessageData> {
    console.log('Creating system chat');
    return mockResponseMessage;
  }

  async createConflictChat(metadata: ConflictChatsTupleMetaInterface): Promise<wsMessageData> {
    console.log('Creating conflict chat');
    return mockResponseMessage;
  }

  async addMessage(chatId: ObjectId, message: MessageInterface): Promise<wsMessageData> {
    // const chatEntity = new ChatEntity();

    // const chat = await chatEntity.findChatByParams({ chatId: chatId });
    // chat.addMessage(message);

    // const chatMessages = await chat.loadMessages([chat.chatId], 0, 0);

    // const response: wsMessageData = {
    //   data: {
    //     messages: chatMessages
    //   }
    // }

    // return response;

    console.log('Adding message into chat');
    return mockResponseMessage;
  }

  async getConflictChatsByAdmin(userId: ObjectId, chatQuery: wsChatPageQueryPayload): Promise<wsMessageData> {
    console.log('Getting conflict chats by admin');
    return mockResponseMessage;
  }

  async getConflictClosedChats(chatQuery: wsChatPageQueryPayload): Promise<wsMessageData> {
    console.log('Getting conflict closed chats');
    return mockResponseMessage;
  }

  async getOpenSystemChats(chatQuery: wsChatPageQueryPayload): Promise<wsMessageData> {
    console.log('Getting open system chats');
    return mockResponseMessage;
  }

  async getClosedSystemChats(chatQuery: wsChatPageQueryPayload): Promise<wsMessageData> {
    console.log('Getting closed system chats');
    return mockResponseMessage;
  }

  async getSystemChatsByUser(userId: ObjectId, chatQuery: wsChatPageQueryPayload): Promise<wsMessageData> {
    console.log('Getting system chats by user');
    return mockResponseMessage;
  }

  async getOpenSystemChatsByAdmin(userId: ObjectId, chatQuery: wsChatPageQueryPayload): Promise<wsMessageData> {
    console.log('Getting open system chats by admin');
    return mockResponseMessage;
  }

  async getClosedSystemChatsByAdmin(userId: ObjectId, chatQuery: wsChatPageQueryPayload): Promise<wsMessageData> {
    console.log('Getting closed system chats by admin');
    return mockResponseMessage;
  }

  async closeChatByTask(taskId: ObjectId) {
    // const chatEntity = new ChatEntity();

    // const chat = await chatEntity.findChatByParams({ taskId: taskId });
    // chat.closeChat();

    console.log('Closing chat by task');
  }

  async closeConflictChats(chatId: ObjectId) {
    console.log('Closing conflict chats');
  }

  async closeSystemChat(chatId: ObjectId) {
    console.log('Closing system chat');
  }
}
