export type UserProfile = {
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  avatar: string;
  address: string;
};

export enum UserStatus {
  UNCONFIRMED = 0,
  CONFIRMED = 1,
  VERIFIED = 2,
  ACTIVATED = 3,
}

export enum UserRole {
  MASTER = 'master',
  ADMIN = 'admin',
  RECIPIENT = 'recipient',
  VOLUNTEER = 'volunteer',
  VISITOR = 'visitor',
}

export enum AdminPermission {
  CONFIRMATION = 'confirm users',
  TASKS = 'create tasks',
  KEYS = 'give keys',
  CONFLICTS = 'resolve conflicts',
  BLOG = 'write the blog',
  CATEGORIES = 'change categories',
}
