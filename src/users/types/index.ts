export enum UserStatus {
  UNCONFIRMED = 'unconfirmed',
  CONFIRMED = 'confirmed',
  VERIFIED = 'verified',
  ACTIVATED = 'activated',
  BLOCKED = 'blocked',
}

export enum UserRole {
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
