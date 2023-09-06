/* eslint-disable no-shadow */

export enum UserStatus {
  UNCONFIRMED = 0,
  CONFIRMED = 1,
  VERIFIED = 2,
  ACTIVATED = 3,
}

export enum EUserRole {
  MASTER = 'master',
  ADMIN = 'admin',
  RECIPIENT = 'recipient',
  VOLUNTEER = 'volunteer',
}

export enum AdminPermission {
  CONFIRMATION = 'confirm users',
  TASKS = 'create tasks',
  KEYS = 'give keys',
  CONFLICTS = 'resolve conflicts',
  BLOG = 'write the blog',
  CATEGORIES = 'change categories',
}

export enum ReportStatus {
  NEW = 'new',
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}
export enum ReportRole {
  RECIPIENT = 'recipient',
  VOLUNTEER = 'volunteer',
}
