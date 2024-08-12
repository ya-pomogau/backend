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

describe('ChatEntity', () => {
  let chatEntity: ChatEntity<ChatType>;
  let chatsRepository: Partial<Record<keyof ChatsRepository, jest.Mock>>;
  let messagesRepository: Partial<Record<keyof MessagesRepository, jest.Mock>>;

  const chatId = new Types.ObjectId().toHexString();

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

    chatEntity = module.get<ChatEntity<ChatType>>(ChatEntity);
  });

  it('should be defined', () => {
    expect(chatEntity).toBeDefined();
  });

  it('should create a task chat', async () => {
    const metadata: TaskChatMetaInterface = {
      taskId: new Types.ObjectId() as any,
      volunteer: {
        name: 'volunteer-name',
        phone: 'volunteer-phone',
        avatar: 'volunteer-avatar',
        address: 'volunteer-address',
        vkId: 'volunteer-vkId',
        role: UserRole.VOLUNTEER,
        _id: new Types.ObjectId().toHexString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      recipient: {
        name: 'recipient-name',
        phone: 'recipient-phone',
        avatar: 'recipient-avatar',
        address: 'recipient-address',
        vkId: 'recipient-vkId',
        role: UserRole.RECIPIENT,
        _id: new Types.ObjectId().toHexString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      isActive: true,
      type: ChatTypes.TASK_CHAT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (chatsRepository.create as jest.Mock).mockResolvedValue({
      _id: chatId,
      ...metadata,
    });

    await chatEntity.createChat(ChatTypes.TASK_CHAT, metadata);

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
        role: UserRole.VOLUNTEER,
        _id: new Types.ObjectId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    const savedMessage = {
      _id: new Types.ObjectId(),
      ...newMessage,
    } as MessageInterface;

    (messagesRepository.create as jest.Mock).mockResolvedValue(savedMessage);

    chatEntity['chatId'] = chatId;
    await chatEntity.addMessage(newMessage);

    expect(messagesRepository.create).toHaveBeenCalledWith({
      ...newMessage,
      chatId,
    });
    expect(chatEntity['messages']).toContainEqual(savedMessage);
  });

  it('should close a chat', async () => {
    const metadata: Partial<TaskChatMetaInterface> = {
      taskId: new Types.ObjectId(),
      isActive: true,
    };

    chatEntity['metadata'] = metadata as TaskChatMetaInterface;
    chatEntity['chatId'] = chatId;

    (chatsRepository.findById as jest.Mock).mockResolvedValue(metadata);
    (chatsRepository.findOneAndUpdate as jest.Mock).mockResolvedValue({});

    await chatEntity.closeChat();

    expect(chatsRepository.findById).toHaveBeenCalledWith(chatId);
    expect(chatsRepository.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: chatId },
      { isActive: false },
      { new: true }
    );
    expect(chatEntity['metadata'].isActive).toBe(false);
  });

  it('should find a chat by params', async () => {
    const metadata: SystemChatMetaInterface = {
      _id: chatId.toHexString(),
      user: {
        name: 'user-name',
        phone: 'user-phone',
        avatar: 'user-avatar',
        address: 'user-address',
        vkId: 'user-vkId',
        role: UserRole.RECIPIENT,
        _id: new Types.ObjectId().toHexString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      admin: {
        name: 'admin-name',
        phone: 'admin-phone',
        avatar: 'admin-avatar',
        address: 'admin-address',
        vkId: 'admin-vkId',
        role: UserRole.ADMIN,
        _id: new Types.ObjectId().toHexString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      isActive: true,
      type: ChatTypes.SYSTEM_CHAT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (chatsRepository.findOne as jest.Mock).mockResolvedValue(metadata);

    const result = await chatEntity.findChatByParams({ _id: chatId });

    expect(chatsRepository.findOne).toHaveBeenCalledWith({ _id: chatId });
    expect(result).toEqual(metadata);
  });
});
