export type PermissionType = {
  id: number;
  name:
    | 'read'
    | 'profiles approval'
    | 'create tasks'
    | 'set keys'
    | 'resolve conflicts'
    | 'blog'
    | 'increase score';
};

// eslint-disable-next-line no-shadow
export enum StatusType {
  Unconfirmed = 'unconfirmed',
  Confirmed = 'confirmed',
  Activated = 'activated',
  Verified = 'verified',
}

// eslint-disable-next-line no-shadow
export enum UserRole {
  Master = 'master',
  Admin = 'admin',
  Recipient = 'recipient',
  Volunteer = 'volunteer',
}
