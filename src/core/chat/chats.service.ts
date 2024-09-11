import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

import { ConflictChatsTupleMetaInterface,
  MessageInterface,
  RecipientConflictChatMetaInterface,
  SystemChatMetaInterface,
  TaskChatMetaInterface,
  VolunteerConflictChatMetaInterface
} from 'src/common/types/chats.types';
import { AdminInterface, UserRole, UserStatus } from 'src/common/types/user.types';
import { wsChatPageQueryPayload, wsMessageData } from 'src/common/types/websockets.types';


//#region Mock data

const mockVolunteer = {
  _id: 'volunteerId',
  role: UserRole.VOLUNTEER,
  name: 'Volunteer',
  phone: 'phone',
  avatar: 'avatar',
  address: 'address',
  vkId: 'vkId',
  score: 0,
  status: UserStatus.CONFIRMED,
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
}

const mockRecipient = {
  _id: 'recepientId',
  role: UserRole.RECIPIENT,
  name: 'Recepient',
  phone: 'phone',
  avatar: 'avatar',
  address: 'address',
  vkId: 'vkId',
  score: 0,
  status: UserStatus.CONFIRMED,
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
}

const mockAdmin: AdminInterface = {
  _id: 'recepientId',
  role: UserRole.ADMIN,
  name: 'Recepient',
  phone: 'phone',
  avatar: 'avatar',
  address: 'address',
  vkId: 'vkId',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  permissions: [],
  login: 'login',
  password: 'password',
  isRoot: false,
  isActive: false,
}

const mockMessages: MessageInterface[] = [
  {
    _id: new mongoose.Types.ObjectId,
    title: 'TestTitle1',
    body: 'TestBody1',
    attaches: ['Hi there!', 'Hi there!'],
    createdAt: new Date(),
    author: mockVolunteer,
    chatId: new mongoose.Types.ObjectId,
  },
  {
    _id: new mongoose.Types.ObjectId,
    title: 'TestTitle2',
    body: 'TestBody2',
    attaches: ['Hi there!', 'Hi there!'],
    createdAt: new Date(),
    author: mockRecipient,
    chatId: new mongoose.Types.ObjectId,
  },
]

const mockResponseMessage: wsMessageData = {
  data: {
    messages: mockMessages
  }
}

const mockTaskChatMeta: TaskChatMetaInterface = {
  _id: new mongoose.Types.ObjectId().toHexString(),
  type: 'TASK_CHAT',
  isActive: true,
  taskId: new mongoose.Types.ObjectId,
  volunteer: mockVolunteer,
  recipient: mockRecipient,
  id: 'test',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  watermark: '',
  unreads: 1,
}

const mockSystemChatMeta: SystemChatMetaInterface = {
  _id: new mongoose.Types.ObjectId().toHexString(),
  type: 'SYSTEM_CHAT',
  isActive: true,
  user: mockRecipient,
  admin: mockAdmin,
  id: 'test2',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  watermark: '',
  unreads: 1,
}

const mockVolunteerChat: VolunteerConflictChatMetaInterface = {
  _id: new mongoose.Types.ObjectId().toHexString(),
  type: "CONFLICT_CHAT_WITH_VOLUNTEER",
  isActive: true,
  volunteer: mockVolunteer,
  id: '10',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  watermark: 'volunteerWatermark',
  unreads: 10,
}

const mockRecipientChat: RecipientConflictChatMetaInterface = {
  _id: new mongoose.Types.ObjectId().toHexString(),
  type: "CONFLICT_CHAT_WITH_RECIPIENT",
  isActive: true,
  recipient: mockRecipient,
  id: '20',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  watermark: 'recipientWatermark',
  unreads: 10,
}

const mockConflictChats: ConflictChatsTupleMetaInterface = {
  moderator: mockAdmin,
  taskId: 'test3',
  adminVolunteerWatermark: 'adminVolunteerWatermark',
  adminVolunteerUnreads: 10,
  adminRecipientWatermark: 'adminRecipientWatermark',
  adminRecipientUnreads: 11,
  meta: [mockVolunteerChat, mockRecipientChat]
}
//#endregion

@Injectable()
export class ChatService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async createTaskChat(metadata: TaskChatMetaInterface): Promise<TaskChatMetaInterface> {
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
    return mockTaskChatMeta;
  }

  async createSystemChat(metadata: SystemChatMetaInterface): Promise<SystemChatMetaInterface> {
    console.log('Creating system chat');
    return mockSystemChatMeta;
  }

  async createConflictChat(metadata: ConflictChatsTupleMetaInterface): Promise<ConflictChatsTupleMetaInterface> {
    console.log('Creating conflict chat');
    return mockConflictChats;
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
