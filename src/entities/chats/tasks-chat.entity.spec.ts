import { Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksChatEntity } from './tasks-chat.entity';
import { ChatsRepository } from '../../datalake/chats/chats.repository';
import { MessagesRepository } from '../../datalake/messages/messages.repository';
import { MessageInterface, TaskChatInterface } from '../../common/types/chats.types';
import { UserStatus } from '../../common/types/user.types';

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
    const metadata: Partial<TaskChatInterface> = {
      taskId: new Types.ObjectId().toHexString(),
      volunteer: {
        name: 'volunteer-name',
        phone: 'volunteer-phone',
        avatar: 'volunteer-avatar',
        address: 'volunteer-address',
        vkId: 'volunteer-vkId',
        role: 'volunteer-role',
        score: 0,
        status: UserStatus.ACTIVATED,
        location: undefined,
        keys: false,
        tasksCompleted: 0,
        _id: new Types.ObjectId().toHexString(),
        createdAt: 'volunteer-createdAt',
        updatedAt: 'volunteer-updatedAt',
      },
      recipient: {
        name: 'recipient-name',
        phone: 'recipient-phone',
        avatar: 'recipient-avatar',
        address: 'recipient-address',
        vkId: 'recipient-vkId',
        role: 'recipient-role',
        status: UserStatus.ACTIVATED,
        location: undefined,
        _id: new Types.ObjectId().toHexString(),
        createdAt: 'recipient-createdAt',
        updatedAt: 'recipient-updatedAt',
      },
      isActive: true,
      type: 'TASK_CHAT',
      volunteerLastReadAt: null,
      recipientLastReadAt: null,
    };

    const messageId = new Types.ObjectId();

    const messages: Partial<MessageInterface>[] = [
      {
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
          createdAt: '',
          updatedAt: '',
          permissions: [],
          login: '',
          password: '',
          isRoot: false,
          isActive: false,
        },
      },
    ];

    (chatsRepository.create as jest.Mock).mockResolvedValue({
      _id: chatId.toHexString(),
      ...metadata,
    });
    (messagesRepository.create as jest.Mock).mockResolvedValue({
      _id: messageId.toHexString(),
      ...messages[0],
    });

    await chatEntity.createChat(metadata as TaskChatInterface, messages as MessageInterface[]);

    expect(chatsRepository.create).toHaveBeenCalledWith(metadata);
    expect(messagesRepository.create).toHaveBeenCalledWith({
      ...messages[0],
      chatId: chatId.toHexString(),
    });
    expect(chatEntity['metadata']?._id).toEqual(chatId.toHexString());
    expect(chatEntity['messages'][0]._id).toEqual(messageId.toHexString());
    expect(chatEntity['chatId']).toEqual(chatId.toHexString());
  });

  it('should find a chat by params', async () => {
    const chatId = new Types.ObjectId().toHexString();
    const metadata: TaskChatInterface = {
      _id: chatId,
      taskId: new Types.ObjectId().toHexString(),
      volunteer: {
        name: 'volunteer-name',
        phone: 'volunteer-phone',
        avatar: 'volunteer-avatar',
        address: 'volunteer-address',
        vkId: 'volunteer-vkId',
        role: 'volunteer-role',
        score: 0,
        status: UserStatus.ACTIVATED,
        location: undefined,
        keys: false,
        tasksCompleted: 0,
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
        role: 'recipient-role',
        status: UserStatus.ACTIVATED,
        location: undefined,
        _id: new Types.ObjectId().toHexString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      isActive: true,
      type: 'TASK_CHAT',
      volunteerLastReadAt: null,
      recipientLastReadAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const messages: MessageInterface[] = [
      {
        _id: new Types.ObjectId().toHexString(),
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
          createdAt: '',
          updatedAt: '',
          permissions: [],
          login: '',
          password: '',
          isRoot: false,
          isActive: false,
        },
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

    await chatEntity.findChatByParams({ taskId: new Types.ObjectId() });

    expect(chatEntity['metadata']).toBeNull();
    expect(chatEntity['messages']).toEqual([]);
  });

  it('should find conflicting chats', async () => {
    const chatId = new Types.ObjectId().toHexString();
    const conflictingChatId = new Types.ObjectId().toHexString();

    const metadata: TaskChatInterface = {
      _id: chatId,
      taskId: new Types.ObjectId().toHexString(),
      volunteer: {
        name: 'volunteer-name',
        phone: 'volunteer-phone',
        avatar: 'volunteer-avatar',
        address: 'volunteer-address',
        vkId: 'volunteer-vkId',
        role: 'volunteer-role',
        score: 0,
        status: UserStatus.ACTIVATED,
        location: undefined,
        keys: false,
        tasksCompleted: 0,
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
        role: 'recipient-role',
        status: UserStatus.ACTIVATED,
        location: undefined,
        _id: new Types.ObjectId().toHexString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      isActive: true,
      type: 'TASK_CHAT',
      volunteerLastReadAt: null,
      recipientLastReadAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const conflictingMetadata: TaskChatInterface = {
      ...metadata,
      _id: conflictingChatId,
    };

    const messages: MessageInterface[] = [
      {
        _id: new Types.ObjectId().toHexString(),
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
          createdAt: '',
          updatedAt: '',
          permissions: [],
          login: '',
          password: '',
          isRoot: false,
          isActive: false,
        },
      },
    ];

    (chatsRepository.find as jest.Mock)
      .mockResolvedValueOnce([metadata])
      .mockResolvedValueOnce([conflictingMetadata]);
    (messagesRepository.find as jest.Mock).mockResolvedValue(messages);

    await chatEntity.findConflictingChats({ taskId: metadata.taskId });

    expect(chatsRepository.find).toHaveBeenCalledWith({ taskId: metadata.taskId });
    expect(chatsRepository.find).toHaveBeenCalledWith({ taskId: metadata.taskId, _id: { $ne: metadata._id } });
    expect(messagesRepository.find).toHaveBeenCalledWith({ chatId: conflictingMetadata._id });
    expect(chatEntity['metadata']).toEqual(conflictingMetadata);
    expect(chatEntity['messages']).toEqual(messages);
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

    const savedMessage = { _id: new Types.ObjectId().toHexString(), ...newMessage } as MessageInterface;

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

    (chatsRepository.find as jest.Mock).mockResolvedValue([{ _id: chatId }]);
    (chatsRepository.updateOne as jest.Mock).mockResolvedValue({});

    await chatEntity.closeChat();

    expect(chatsRepository.find).toHaveBeenCalledWith({ _id: chatId });
    expect(chatsRepository.updateOne).toHaveBeenCalledWith({ _id: chatId }, { isActive: false });
    expect(chatEntity['metadata'].isActive).toBe(false);
  });
});
