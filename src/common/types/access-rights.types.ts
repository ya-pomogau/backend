// eslint-disable-next-line import/no-cycle
import { UserRole, UserStatus } from './user.types';

export enum AccessRights {
  editAnyProfile = 'EDIT_PROFILE',
  editOwnProfile = 'EDIT_OWN_PROFILE',
  getALLTasks = 'GET_TASKS',
  getVirginTasks = 'GET_VIRGIN_TASKS',
  getOwnTasks = 'GET_OWN_TASKS',
  acceptTask = 'ACCEPT_TASK',
  chatAdmin = 'CHAT_2_ADMIN',
  chatUser = `CHAT_2_USER`,
  createTask = 'CREATE_TASK',
  confirmUser = 'CONFIRM_USER',
  promoteUser = 'PROMOTE_USER',
  giveKey = 'GIVE_KEY',
  resolveConflict = 'RESOLVE_CONFLICT',
  contentEditor = 'EDIT_BLOG',
  blockUser = 'BLOCK_USER',
  dropAnyTask = 'DELETE_TASK',
  dropOwnTask = 'DROP_OWN_TASK',
  confirmAnyTask = 'ADMIN_TASK_CONFIRM',
  reportTaskStatus = 'REPORT_OWN_TASK_STATUS',
  dropAnyAccept = 'DROP_ACCEPT_TASK',
  dropOwnAccept = 'DROP_OWN_ACCEPT_TASK',
  taskStats = 'GET_TASKS_STATISTICS',
  userStats = 'GET_USERS_STATISTICS',
  categoryPoints = 'SET_CATEGORY_POINTS',
  summonAdmin = 'CREATE_ADMINISTRATOR',
  confirmAdmin = 'CONFIRM_ADMINISTRATOR',
  alterPassword = 'CHANGE_ADMIN_PASSWORD',
  editLegislative = 'CHANGE_CONFIDENTIALITY_POLICY',
  editContacts = 'CHANGE_CONTACTS_INFO',
  createPost = 'CREATE_POST',
  updatePost = 'UPDATE_POST',
  deletePost = 'DELETE_POST',
}

export type AccessRightType = `${AccessRights}`;

export type AccessRightsObject = {
  role?: UserRole;
  rights?: Array<AccessRights>;
  level?: UserStatus;
  isRoot?: boolean;
};
