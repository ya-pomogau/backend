import { Types } from 'mongoose';
import {
  MessageInterface,
  TaskChatMetaInterface,
  SystemChatMetaInterface,
  ConflictChatsTupleMetaInterface,
  ChatTypes,
} from '../../common/types/chats.types';
import { UserRole, UserStatus } from '../../common/types/user.types';
import { PointGeoJSON } from '../../common/schemas/PointGeoJSON.schema';

export const chatId = new Types.ObjectId().toHexString();
export const taskId = new Types.ObjectId().toHexString();

export const recipientMessage: MessageInterface = {
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

export const volunteerMessage: MessageInterface = {
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

export const taskChatMetadata: TaskChatMetaInterface = {
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

export const systemChatMetadata: SystemChatMetaInterface = {
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

export const conflictChatsMetadata: ConflictChatsTupleMetaInterface = {
  taskId: taskId,
  moderator: {
    name: 'moderatorName',
    phone: 'moderatorPhone',
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
      type: ChatTypes.CONFLICT_CHAT_WITH_RECIPIENT as any,
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

export const taskСhatMessages: MessageInterface[] = [
  recipientMessage,
  volunteerMessage,
  volunteerMessage,
  recipientMessage,
];

export const systemСhatMessages: MessageInterface[] = [
  volunteerMessage,
  recipientMessage,
  recipientMessage,
  volunteerMessage,
];

export const conflictСhatMessages: MessageInterface[] = [
  recipientMessage,
  recipientMessage,
  volunteerMessage,
  recipientMessage,
  volunteerMessage,
  recipientMessage,
  recipientMessage,
];
