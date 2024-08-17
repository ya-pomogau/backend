import { Types, ObjectId } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatEntity } from './chat.entity';
import { ChatsRepository } from '../../datalake/chats/chats.repository';
import { MessagesRepository } from '../../datalake/messages/messages.repository';
import {
  MessageInterface,
  TaskChatMetaInterface,
  SystemChatMetaInterface,
  ConflictChatsTupleMetaInterface,
  ChatType,
  ChatTypes,
} from '../../common/types/chats.types';
import { UserRole, UserStatus } from '../../common/types/user.types';
import { PointGeoJSON } from '../../common/schemas/PointGeoJSON.schema';

describe('ChatEntity', () => {
  let chatEntity: ChatEntity<ChatType>;
  let chatsRepository: Partial<Record<keyof ChatsRepository, jest.Mock>>;
  let messagesRepository: Partial<Record<keyof MessagesRepository, jest.Mock>>;

  const chatId = new Types.ObjectId().toHexString();

  const taskId = new Types.ObjectId().toHexString();

  beforeEach(async () => {
    chatsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOne: jest.fn(),
    };
    messagesRepository = {
      create: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatEntity,
        { provide: ChatsRepository, useValue: chatsRepository },
        { provide: MessagesRepository, useValue: messagesRepository },
      ],
    }).compile();

    chatEntity = await module.resolve<ChatEntity<ChatType>>(ChatEntity);
  });

  it('should be defined', () => {
    expect(chatEntity).toBeDefined();
  });

  it('should create a task chat', async () => {
    const metadata: TaskChatMetaInterface = {
      isActive: true,
      volunteer: {
        name: 'name',
        phone: 'phone',
        avatar: 'avatar',
        address: 'address',
        vkId: 'vkId',
        role: 'role',
        score: 0,
        status: UserStatus.BLOCKED,
        location: undefined,
        keys: false,
        tasksCompleted: 0,
        _id: new Types.ObjectId().toHexString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      recipient: {
        name: 'name',
        phone: 'phone',
        avatar: 'avatar',
        address: 'address',
        vkId: 'vkId',
        role: 'role',
        status: UserStatus.BLOCKED,
        location: undefined,
        _id: new Types.ObjectId().toHexString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      type: ChatTypes.TASK_CHAT as any,
      taskId: taskId as any,
      _id: chatId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      watermark: '',
      unreads: 0,
    };

    (chatsRepository.create as jest.Mock).mockResolvedValue({
      _id: chatId,
      ...metadata,
    });

    await chatEntity.createChat(ChatTypes.TASK_CHAT as any, metadata);

    expect(chatsRepository.create).toHaveBeenCalledWith({
      ...metadata,
      isActive: true,
    });

    expect(chatEntity.chatId).toEqual(chatId);
    expect(chatEntity.metadata).toEqual(metadata);
    expect(chatEntity['_taskId']).toEqual(taskId);
    expect(chatEntity['_volunteer']).toEqual(metadata.volunteer);
    expect(chatEntity['_recipient']).toEqual(metadata.recipient);
  });
  it('should create a system chat', async () => {
    const metadata: SystemChatMetaInterface = {
      isActive: true,
      user: {
        name: 'name',
        phone: 'phone',
        avatar: 'avatar',
        address: 'address',
        vkId: 'vkId',
        role: UserRole.RECIPIENT,
        status: UserStatus.ACTIVATED,
        _id: new Types.ObjectId().toHexString(),
        location: { type: 'Point', coordinates: [0, 0] } as PointGeoJSON,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      admin: {
        name: 'adminName',
        phone: 'adminPhone',
        _id: new Types.ObjectId().toHexString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avatar: 'avatar',
        address: 'address',
        vkId: 'vkId',
        role: 'role',
        permissions: [],
        login: 'login',
        password: 'password',
        isRoot: false,
        isActive: false,
      },
      type: ChatTypes.SYSTEM_CHAT as any,
      _id: chatId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      watermark: 'watermark',
      unreads: 0,
    };

    (chatsRepository.create as jest.Mock).mockResolvedValue({
      _id: chatId,
      ...metadata,
    });

    await chatEntity.createChat(ChatTypes.SYSTEM_CHAT as any, metadata);

    expect(chatsRepository.create).toHaveBeenCalledWith({
      ...metadata,
      isActive: true,
    });

    expect(chatEntity.chatId).toEqual(chatId);
    expect(chatEntity.metadata).toEqual(metadata);
    expect(chatEntity['_volunteer']).toBeNull();
    expect(chatEntity['_recipient']).toEqual(metadata.user);
    expect(chatEntity['_admin']).toEqual(metadata.admin);
  });

  it('should create a conflict chat with recipient', async () => {
    const metadata: ConflictChatsTupleMetaInterface = {
      taskId: taskId,
      moderator: {
        name: 'moderatorName',
        phone: 'moderatorPhone',
        _id: new Types.ObjectId().toHexString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avatar: '',
        address: '',
        vkId: '',
        role: '',
        permissions: [],
        login: '',
        password: '',
        isRoot: false,
        isActive: false,
      },
      meta: [
        {
          isActive: true,
          type: ChatTypes.CONFLICT_CHAT_WITH_VOLUNTEER as any,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _id: new Types.ObjectId().toHexString(),
          watermark: 'watermark',
          unreads: 0,
          volunteer: {
            name: 'name',
            phone: 'phone',
            avatar: 'avatar',
            address: 'address',
            vkId: 'vkId',
            role: 'role',
            score: 0,
            status: UserStatus.BLOCKED,
            location: undefined,
            keys: false,
            tasksCompleted: 0,
            _id: new Types.ObjectId().toHexString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
        {
          isActive: true,
          type: ChatTypes.CONFLICT_CHAT_WITH_VOLUNTEER as any,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _id: new Types.ObjectId().toHexString(),
          watermark: 'watermark',
          unreads: 0,
          recipient: {
            name: 'name',
            phone: 'phone',
            avatar: 'avatar',
            address: 'address',
            vkId: 'vkId',
            role: 'role',
            status: UserStatus.BLOCKED,
            location: undefined,
            _id: new Types.ObjectId().toHexString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      ],
      adminVolunteerWatermark: 'watermark',
      adminVolunteerUnreads: 0,
      adminRecipientWatermark: 'watermark',
      adminRecipientUnreads: 0
    };

    (chatsRepository.create as jest.Mock).mockResolvedValue({
      _id: chatId,
      ...metadata,
    });

    await chatEntity.createChat(ChatTypes.CONFLICT_CHAT_WITH_RECIPIENT as any, metadata);

    expect(chatsRepository.create).toHaveBeenCalledWith({
      ...metadata,
      isActive: true,
    });

    expect(chatEntity.chatId).toEqual(chatId);
    expect(chatEntity.metadata).toEqual(metadata);
    expect(chatEntity['_taskId']).toEqual(taskId);
    expect(chatEntity['_volunteer']).toEqual(metadata.meta[0].volunteer);
    expect(chatEntity['_recipient']).toEqual(metadata.meta[1].recipient);
    expect(chatEntity['_admin']).toEqual(metadata.moderator);
  });
});
