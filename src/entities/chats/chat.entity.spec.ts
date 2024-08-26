import { Types } from 'mongoose';
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

  const recipientMessage: MessageInterface = {
    _id: new Types.ObjectId().toHexString() as any,
    title: 'title',
    body: 'Hello',
    attaches: ['Hi there!', 'Hi there!'],
    createdAt: new Date(),
    author: {
      _id: 'recipientId',
      role: UserRole.RECIPIENT,
      name: 'Recipient',
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
    chatId: chatId as any,
  };

  const volunteerMessage: MessageInterface = {
    _id: new Types.ObjectId().toHexString() as any,
    title: 'title',
    body: 'Hello',
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
    chatId: chatId as any,
  };

  const taskChatMetadata: TaskChatMetaInterface = {
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

  const taskСhatMessages: MessageInterface[] = [
    recipientMessage,
    volunteerMessage,
    volunteerMessage,
    recipientMessage,
  ];

  const systemChatMetadata: SystemChatMetaInterface = {
    _id: chatId,
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
    watermark: 'watermark',
    unreads: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const systemСhatMessages: MessageInterface[] = [
    volunteerMessage,
    recipientMessage,
    recipientMessage,
    volunteerMessage,
  ];

  const conflictChatsMetadata: ConflictChatsTupleMetaInterface = {
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
        type: ChatTypes.CONFLICT_CHAT as any,
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
        type: ChatTypes.CONFLICT_CHAT as any,
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
    adminRecipientUnreads: 0,
  };

  const conflictСhatMessages: MessageInterface[] = [
    recipientMessage,
    recipientMessage,
    volunteerMessage,
    recipientMessage,
    volunteerMessage,
    recipientMessage,
    recipientMessage,
  ];

  beforeEach(async () => {
    chatsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOne: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };
    messagesRepository = {
      create: jest.fn(),
      find: jest.fn(),
    };

    chatEntity = new ChatEntity<ChatType>(
      chatsRepository as unknown as ChatsRepository,
      messagesRepository as unknown as MessagesRepository
    );
  });

  it('should be defined', () => {
    expect(chatEntity).toBeDefined();
  });

  it('Should create, load messages, add message, find by params and close a task chat', async () => {
    (chatsRepository.create as jest.Mock).mockResolvedValue({
      _id: chatId,
      ...taskChatMetadata,
    });
    await chatEntity.createChat(ChatTypes.TASK_CHAT as any, taskChatMetadata);
    expect(chatEntity['_chatId']).toEqual(chatId);
    expect(chatEntity['_taskId']).toEqual(taskId);
    expect(chatEntity['_volunteer']).toEqual(taskChatMetadata.volunteer);
    expect(chatEntity['_recipient']).toEqual(taskChatMetadata.recipient);
    expect(chatEntity['_metadata']['isActive']).toEqual(true);

    (messagesRepository.find as jest.Mock).mockResolvedValue(taskСhatMessages);
    const loadedMessages = await chatEntity.loadMessages(0, 20);
    expect(loadedMessages).toEqual(taskСhatMessages);
    expect(messagesRepository.find).toHaveBeenCalledWith({ chatId: chatId }, null, {
      skip: 0,
      limit: 20,
    });

    const params = { taskId };
    (chatsRepository.findOne as jest.Mock).mockResolvedValue({
      ...taskChatMetadata,
      _id: chatId,
    });
    const foundChat = await chatEntity.findChatByParams(params);
    expect(foundChat).toBeInstanceOf(ChatEntity);
    expect(foundChat!.chatId).toEqual(chatId);
    expect(foundChat!.metadata).toEqual(taskChatMetadata);
    expect(chatsRepository.findOne).toHaveBeenCalledWith(params);

    (messagesRepository.create as jest.Mock).mockResolvedValue(volunteerMessage);
    await chatEntity.addMessage(volunteerMessage);
    expect(chatEntity.messages).toContainEqual(volunteerMessage);
    expect(messagesRepository.create).toHaveBeenCalledWith({
      ...volunteerMessage,
      chatId: chatEntity.chatId,
    });

    (chatsRepository.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      ...taskChatMetadata,
      isActive: false,
    });
    await chatEntity.closeChat();
    expect(chatEntity['_metadata']['isActive']).toEqual(false);
    expect(chatsRepository.findByIdAndUpdate).toHaveBeenCalledWith(
      chatId,
      { isActive: false },
      { new: true }
    );
  });

  it('Should create, load messages, add message, find by params and close a system chat', async () => {
    (chatsRepository.create as jest.Mock).mockResolvedValue({
      _id: chatId,
      ...systemChatMetadata,
    });
    await chatEntity.createChat(ChatTypes.SYSTEM_CHAT as any, systemChatMetadata);
    expect(chatEntity['_chatId']).toEqual(chatId);
    expect(chatEntity['_user']).toEqual(systemChatMetadata.user); // Проверка _user
    expect(chatEntity['_admin']).toEqual(systemChatMetadata.admin);
    expect(chatEntity['_metadata']['isActive']).toEqual(true);

    (messagesRepository.find as jest.Mock).mockResolvedValue(systemСhatMessages);
    const loadedMessages = await chatEntity.loadMessages(0, 20);
    expect(loadedMessages).toEqual(systemСhatMessages);
    expect(messagesRepository.find).toHaveBeenCalledWith({ chatId: chatId }, null, {
      skip: 0,
      limit: 20,
    });

    const params = { taskId };
    (chatsRepository.findOne as jest.Mock).mockResolvedValue({
      ...systemChatMetadata,
      _id: chatId,
    });
    const foundChat = await chatEntity.findChatByParams(params);
    expect(foundChat).toBeInstanceOf(ChatEntity);
    expect(foundChat!.chatId).toEqual(chatId);
    expect(foundChat!.metadata).toEqual(systemChatMetadata);
    expect(chatsRepository.findOne).toHaveBeenCalledWith(params);

    (messagesRepository.create as jest.Mock).mockResolvedValue(volunteerMessage);
    await chatEntity.addMessage(volunteerMessage);
    expect(chatEntity.messages).toContainEqual(volunteerMessage);
    expect(messagesRepository.create).toHaveBeenCalledWith({
      ...volunteerMessage,
      chatId: chatEntity.chatId,
    });

    (chatsRepository.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      ...systemChatMetadata,
      isActive: false,
    });
    await chatEntity.closeChat();
    expect(chatEntity['_metadata']['isActive']).toEqual(false);
    expect(chatsRepository.findByIdAndUpdate).toHaveBeenCalledWith(
      chatId,
      { isActive: false },
      { new: true }
    );
  });

  it('Should create, load messages, add message, find by params and close a conflict chat with recipient', async () => {
    (chatsRepository.create as jest.Mock).mockResolvedValue({
      _id: chatId,
      ...conflictChatsMetadata,
    });
    await chatEntity.createChat(ChatTypes.CONFLICT_CHAT as any, conflictChatsMetadata);
    expect(chatEntity['_chatId']).toEqual(chatId);
    expect(chatEntity['_taskId']).toEqual(taskId);
    expect(chatEntity['_volunteer']).toEqual(conflictChatsMetadata.meta[0].volunteer);
    expect(chatEntity['_recipient']).toEqual(conflictChatsMetadata.meta[1].recipient);
    expect(chatEntity['_admin']).toEqual(conflictChatsMetadata.moderator);
    expect(chatEntity['_metadata']['isActive']).toEqual(true);

    (messagesRepository.find as jest.Mock).mockResolvedValue(conflictСhatMessages);
    const loadedMessages = await chatEntity.loadMessages(0, 20);
    expect(loadedMessages).toEqual([
      [volunteerMessage, volunteerMessage],
      [recipientMessage, recipientMessage, recipientMessage, recipientMessage, recipientMessage],
    ]);
    expect(messagesRepository.find).toHaveBeenCalledWith({ chatId: chatId }, null, {
      skip: 0,
      limit: 20,
    });

    const params = { taskId };
    (chatsRepository.findOne as jest.Mock).mockResolvedValue({
      ...conflictChatsMetadata,
      _id: chatId,
    });
    const foundChat = await chatEntity.findChatByParams(params);
    expect(foundChat).toBeInstanceOf(ChatEntity);
    expect(foundChat!.chatId).toEqual(chatId);

    const expectedMetadata = {
      ...conflictChatsMetadata,
      _id: chatId,
    };
    expect(foundChat!.metadata).toEqual(expectedMetadata);
    expect(chatsRepository.findOne).toHaveBeenCalledWith(params);

    (messagesRepository.create as jest.Mock).mockResolvedValue(volunteerMessage);
    await chatEntity.addMessage(volunteerMessage);
    expect(chatEntity.messages[0]).toContainEqual(volunteerMessage);
    expect(messagesRepository.create).toHaveBeenCalledWith({
      ...volunteerMessage,
      chatId: chatEntity.chatId,
    });

    (messagesRepository.create as jest.Mock).mockResolvedValue(recipientMessage);
    await chatEntity.addMessage(recipientMessage);
    expect(chatEntity.messages[1]).toContainEqual(recipientMessage);
    expect(messagesRepository.create).toHaveBeenCalledWith({
      ...recipientMessage,
      chatId: chatEntity.chatId,
    });

    (chatsRepository.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      ...conflictChatsMetadata,
      isActive: false,
    });
    await chatEntity.closeChat();
    expect(chatEntity['_metadata']['isActive']).toEqual(false);
    expect(chatsRepository.findByIdAndUpdate).toHaveBeenCalledWith(
      chatId,
      { isActive: false },
      { new: true }
    );
  });
});
