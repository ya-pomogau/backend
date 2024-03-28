import { AccessRights } from '../types/access-rights.types';
import { UserRole } from '../types/user.types';

export const userACL = [AccessRights.editOwnProfile];
export const volunteerACL = [
  ...userACL,
  AccessRights.acceptTask,
  AccessRights.getVirginTasks,
  AccessRights.reportTaskStatus,
  AccessRights.chatAdmin,
  AccessRights.dropOwnAccept,
];
export const recipientACL = [
  ...userACL,
  AccessRights.createTask,
  AccessRights.reportTaskStatus,
  AccessRights.dropOwnTask,
  AccessRights.getOwnTasks,
];
export const adminACL = [
  AccessRights.dropAnyAccept,
  AccessRights.dropAnyTask,
  AccessRights.acceptTask,
  AccessRights.reportTaskStatus,
  AccessRights.confirmAnyTask,
  AccessRights.getALLTasks,
  AccessRights.taskStats,
  AccessRights.userStats,
  ...volunteerACL,
  ...recipientACL,
];
export const rootACL = Object.values(AccessRights);

export const ACL = {
  [UserRole.VOLUNTEER]: volunteerACL,
  [UserRole.RECIPIENT]: recipientACL,
  [UserRole.ADMIN]: adminACL,
};
