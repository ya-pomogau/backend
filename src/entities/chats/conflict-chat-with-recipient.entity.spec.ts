import { Types, ObjectId } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictChatWithRecipientEntity } from './conflict-chat-with-recipient.entity';
import { ChatsRepository } from '../../datalake/chats/chats.repository';
import { MessagesRepository } from '../../datalake/messages/messages.repository';
import {
  MessageInterface,
  ConflictChatWithRecipientInterface,
} from '../../common/types/chats.types';
import { UserStatus } from '../../common/types/user.types';
import { TaskDto } from '../../common/dtos/tasks.dto';
import { PointGeoJSON } from '../../common/schemas/PointGeoJSON.schema';
import { Category } from '../../datalake/category/schemas/category.schema';
import { ResolveStatus } from '../../common/types/task.types';

describe('ConflictChatWithVolunteerEntity', () => {
  let chatEntity: ConflictChatWithRecipientEntity;
  let chatsRepository: Partial<Record<keyof ChatsRepository, jest.Mock>>;
  let messagesRepository: Partial<Record<keyof MessagesRepository, jest.Mock>>;

  const chatId = new Types.ObjectId() as any;

  beforeEach(async () => {
    chatsRepository = {
      create: jest.fn(),
      find: jest.fn(),
      updateOne: jest.fn(),
      findById: jest.fn(),
    };
    messagesRepository = {
      create: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConflictChatWithRecipientEntity,
        { provide: ChatsRepository, useValue: chatsRepository },
        { provide: MessagesRepository, useValue: messagesRepository },
      ],
    }).compile();

    chatEntity = await module.resolve<ConflictChatWithRecipientEntity>(
      ConflictChatWithRecipientEntity
    );
  });

  it('should be defined', () => {
    expect(chatEntity).toBeDefined();
  });

  it('should create a chat', async () => {
    const metadata: TaskDto = {
      volunteer: {
        name: 'volunteer-name',
        phone: 'volunteer-phone',
        avatar: 'volunteer-avatar',
        address: 'volunteer-address',
        vkId: 'volunteer-vkId',
        role: 'volunteer-role',
        _id: new Types.ObjectId() as any,
      },
      recipient: {
        name: 'recipient-name',
        phone: 'recipient-phone',
        avatar: 'recipient-avatar',
        address: 'recipient-address',
        vkId: 'recipient-vkId',
        role: 'recipient-role',
        _id: new Types.ObjectId() as any,
      },
      title: '',
      date: null,
      address: '',
      location: { type: 'Point', coordinates: [0, 0] } as PointGeoJSON,
      category: {
        _id: new Types.ObjectId(),
        title: 'category-title',
        points: 0,
        accessLevel: UserStatus.ACTIVATED,
      } as Category,
      volunteerReport: ResolveStatus.VIRGIN,
      recipientReport: ResolveStatus.VIRGIN,
      adminResolve: ResolveStatus.VIRGIN,
      isPendingChanges: false,
    };

    (chatsRepository.create as jest.Mock).mockResolvedValue({
      _id: chatId,
      ...metadata,
    });

    await chatEntity.createChat(metadata);

    expect(chatsRepository.create).toHaveBeenCalledWith({
      ...metadata,
      isActive: true,
    });
    expect(chatEntity['metadata']?._id).toEqual(chatId);
    expect(chatEntity['chatId']).toEqual(chatId);
  });

  it('should add a message', async () => {
    const newMessage: Partial<MessageInterface> = {
      title: 'new title',
      body: 'new body',
      attaches: ['new attaches'],
      createdAt: new Date(),
      author: {
        name: 'new name',
        phone: 'new phone',
        avatar: 'new avatar',
        address: 'new address',
        vkId: 'new vkId',
        role: 'new role',
        score: 0,
        status: UserStatus.ACTIVATED,
        location: undefined,
        keys: false,
        tasksCompleted: 0,
        _id: new Types.ObjectId() as any,
        createdAt: '',
        updatedAt: '',
        permissions: [],
        login: '',
        password: '',
        isRoot: false,
        isActive: false,
      },
    };

    const savedMessage = {
      _id: new Types.ObjectId(),
      ...newMessage,
    } as MessageInterface;

    (messagesRepository.create as jest.Mock).mockResolvedValue(savedMessage);

    chatEntity['chatId'] = chatId;
    await chatEntity.addMessage(chatId, newMessage);

    expect(messagesRepository.create).toHaveBeenCalledWith({
      ...newMessage,
      chatId,
    });
    expect(chatEntity['messages']).toContainEqual(savedMessage);
  });

  it('should close a chat', async () => {
    const metadata: Partial<ConflictChatWithRecipientInterface> = {
      _id: chatId,
      isActive: true,
    } as unknown as Partial<ConflictChatWithRecipientInterface>;

    chatEntity['metadata'] = metadata as ConflictChatWithRecipientInterface;
    chatEntity['chatId'] = chatId;

    (chatsRepository.findById as jest.Mock).mockResolvedValue(metadata);
    (chatsRepository.updateOne as jest.Mock).mockResolvedValue({});

    await chatEntity.closeChat();

    expect(chatsRepository.findById).toHaveBeenCalledWith(chatId);
    expect(chatsRepository.updateOne).toHaveBeenCalledWith(
      { _id: chatId },
      { isActive: false },
      {}
    );
    expect(chatEntity['metadata'].isActive).toBe(false);
  });

  it('should find a chat by params', async () => {
    const metadata: ConflictChatWithRecipientInterface = {
      _id: chatId,
      recipient: {
        name: 'volunteer-name',
        phone: 'volunteer-phone',
        avatar: 'volunteer-avatar',
        address: 'volunteer-address',
        vkId: 'volunteer-vkId',
        role: 'volunteer-role',
        status: UserStatus.ACTIVATED,
        location: undefined,
        _id: new Types.ObjectId() as any,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      },
      admin: {
        name: 'admin-name',
        phone: 'admin-phone',
        avatar: 'admin-avatar',
        address: 'admin-address',
        vkId: 'admin-vkId',
        role: 'admin-role',
        _id: new Types.ObjectId() as any,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        permissions: [],
        login: '',
        password: '',
        isRoot: false,
        isActive: false,
      },
      isActive: true,
      type: 'TASK_CHAT',
      recipientLastReadAt: null,
      adminLastReadAt: null,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      taskId: new Types.ObjectId() as any,
      opponentChat: new Types.ObjectId() as any,
    };

    const messages: MessageInterface[] = [
      {
        _id: new Types.ObjectId() as any,
        title: 'title',
        body: 'body',
        attaches: ['attaches', 'attaches'],
        createdAt: new Date(),
        author: {
          name: 'string',
          phone: 'string',
          avatar: 'string',
          address: 'string',
          vkId: 'string',
          role: 'string',
          score: 0,
          status: UserStatus.ACTIVATED,
          location: undefined,
          keys: false,
          tasksCompleted: 0,
          _id: new Types.ObjectId().toHexString(),
          createdAt: new Date().toString(),
          updatedAt: new Date().toString(),
          permissions: [],
          login: '',
          password: '',
          isRoot: false,
          isActive: false,
        },
        chatId: chatId,
      },
    ];

    (chatsRepository.find as jest.Mock).mockResolvedValue([metadata]);
    (messagesRepository.find as jest.Mock).mockResolvedValue(messages);

    await chatEntity.findChatByParams({ taskId: metadata.taskId });

    expect(chatsRepository.find).toHaveBeenCalledWith({ taskId: metadata.taskId });
    expect(messagesRepository.find).toHaveBeenCalledWith({ chatId: metadata._id });
    expect(chatEntity['metadata']).toEqual(metadata);
    expect(chatEntity['messages']).toEqual(messages);
  });

  it('should return null metadata and empty messages if no chat is found', async () => {
    (chatsRepository.find as jest.Mock).mockResolvedValue([]);
    (messagesRepository.find as jest.Mock).mockResolvedValue([]);

    await chatEntity.findChatByParams({ taskId: new Types.ObjectId() as any });

    expect(chatEntity['metadata']).toBeNull();
    expect(chatEntity['messages']).toEqual([]);
  });

  it('should find conflicting chats', async () => {
    const metadata: ConflictChatWithRecipientInterface = {
      _id: new Types.ObjectId() as any,
      recipient: {
        name: 'volunteer-name',
        phone: 'volunteer-phone',
        avatar: 'volunteer-avatar',
        address: 'volunteer-address',
        vkId: 'volunteer-vkId',
        role: 'volunteer-role',
        status: UserStatus.ACTIVATED,
        location: undefined,
        _id: new Types.ObjectId().toString(),
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      },
      admin: {
        name: 'admin-name',
        phone: 'admin-phone',
        avatar: 'admin-avatar',
        address: 'admin-address',
        vkId: 'admin-vkId',
        role: 'admin-role',
        _id: new Types.ObjectId().toHexString(),
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        permissions: [],
        login: '',
        password: '',
        isRoot: false,
        isActive: false,
      },
      isActive: true,
      type: 'TASK_CHAT',
      recipientLastReadAt: null,
      adminLastReadAt: null,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      taskId: new Types.ObjectId() as any,
      opponentChat: new Types.ObjectId() as any,
    };

    const conflictChat = {
      _id: new Types.ObjectId(),
      taskId: metadata.taskId,
      volunteer: {
        name: 'volunteer-name-2',
        phone: 'volunteer-phone-2',
        avatar: 'volunteer-avatar-2',
        address: 'volunteer-address-2',
        vkId: 'volunteer-vkId-2',
        role: 'volunteer-role-2',
        score: 0,
        status: UserStatus.ACTIVATED,
        location: undefined,
        keys: false,
        tasksCompleted: 0,
        _id: new Types.ObjectId(),
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      },
      admin: {
        name: 'admin-name-2',
        phone: 'admin-phone-2',
        avatar: 'admin-avatar-2',
        address: 'admin-address-2',
        vkId: 'admin-vkId-2',
        role: 'admin-role-2',
        score: 0,
        status: UserStatus.ACTIVATED,
        location: undefined,
        keys: false,
        tasksCompleted: 0,
        _id: new Types.ObjectId(),
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      },
      isActive: true,
      type: 'TASK_CHAT',
      volunteerLastReadAt: null,
      adminLastReadAt: null,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };

    const messages: MessageInterface[] = [
      {
        _id: new Types.ObjectId() as any,
        chatId: chatId,
        title: 'title',
        body: 'body',
        attaches: ['attaches', 'attaches'],
        createdAt: new Date(),
        author: {
          name: 'string',
          phone: 'string',
          avatar: 'string',
          address: 'string',
          vkId: 'string',
          role: 'string',
          score: 0,
          status: UserStatus.ACTIVATED,
          location: undefined,
          keys: false,
          tasksCompleted: 0,
          _id: new Types.ObjectId() as any,
          createdAt: new Date().toString(),
          updatedAt: new Date().toString(),
          permissions: [],
          login: '',
          password: '',
          isRoot: false,
          isActive: false,
        },
      },
    ];

    (chatsRepository.find as jest.Mock).mockResolvedValueOnce([metadata]);
    (chatsRepository.find as jest.Mock).mockResolvedValueOnce([conflictChat]);
    (messagesRepository.find as jest.Mock).mockResolvedValue(messages);

    await chatEntity.findConflictingChats({ taskId: metadata.taskId });

    expect(chatsRepository.find).toHaveBeenCalledWith({ taskId: metadata.taskId });
    expect(messagesRepository.find).toHaveBeenCalledWith({ chatId: conflictChat._id });
    expect(chatEntity['metadata']).toEqual(conflictChat);
    expect(chatEntity['messages']).toEqual(messages);
  });
});
