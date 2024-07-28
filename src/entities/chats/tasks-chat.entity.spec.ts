import { Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksChatEntity } from './tasks-chat.entity';
import { ChatsRepository } from '../../datalake/chats/chats.repository';
import { MessagesRepository } from '../../datalake/messages/messages.repository';
import { MessageInterface, TaskChatInterface } from '../../common/types/chats.types';
import { UserStatus } from '../../common/types/user.types';
import { TaskDto } from '../../common/dtos/tasks.dto';
import { PointGeoJSON } from '../../common/schemas/PointGeoJSON.schema';
import { Category } from '../../datalake/category/schemas/category.schema';
import { ResolveStatus } from '../../common/types/task.types';

describe('TasksChatEntity', () => {
  let chatEntity: TasksChatEntity;
  let chatsRepository: Partial<Record<keyof ChatsRepository, jest.Mock>>;
  let messagesRepository: Partial<Record<keyof MessagesRepository, jest.Mock>>;

  const chatId = new Types.ObjectId();

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
        TasksChatEntity,
        { provide: ChatsRepository, useValue: chatsRepository },
        { provide: MessagesRepository, useValue: messagesRepository },
      ],
    }).compile();

    chatEntity = await module.resolve<TasksChatEntity>(TasksChatEntity);
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
        _id: new Types.ObjectId().toHexString(),
      },
      recipient: {
        name: 'recipient-name',
        phone: 'recipient-phone',
        avatar: 'recipient-avatar',
        address: 'recipient-address',
        vkId: 'recipient-vkId',
        role: 'recipient-role',
        _id: new Types.ObjectId().toHexString(),
      },
      title: '',
      date: undefined,
      address: '',
      location: { type: 'Point', coordinates: [0, 0] } as PointGeoJSON,
      category: {
        _id: new Types.ObjectId().toHexString(),
        title: 'category-title',
        points: 0,
        accessLevel: UserStatus.ACTIVATED,
      } as Category,
      volunteerReport: ResolveStatus.VIRGIN,
      recipientReport: ResolveStatus.VIRGIN,
      adminResolve: ResolveStatus.VIRGIN,
      isPendingChanges: false,
    };

    const chatId = new Types.ObjectId().toHexString();

    (chatsRepository.create as jest.Mock).mockResolvedValue({
      _id: chatId,
      ...metadata,
    });

    await chatEntity.createChat(metadata);

    expect(chatsRepository.create).toHaveBeenCalledWith({
      ...metadata,
      isActive: true, // ensure isActive flag is added
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
        _id: new Types.ObjectId().toHexString(),
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
      _id: new Types.ObjectId().toHexString(),
      ...newMessage,
    } as MessageInterface;

    (messagesRepository.create as jest.Mock).mockResolvedValue(savedMessage);

    chatEntity['chatId'] = chatId.toHexString();
    await chatEntity.addMessage(chatId.toHexString(), newMessage);

    expect(messagesRepository.create).toHaveBeenCalledWith({
      ...newMessage,
      chatId: chatId.toHexString(),
    });
    expect(chatEntity['messages']).toContainEqual(savedMessage);
  });

  it('should close a chat', async () => {
    const chatId = new Types.ObjectId().toHexString();
    const metadata: Partial<TaskChatInterface> = {
      _id: chatId,
      isActive: true,
    } as Partial<TaskChatInterface>;

    chatEntity['metadata'] = metadata as TaskChatInterface;
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
});
