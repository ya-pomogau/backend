export type UserRole = 'master' | 'admin' | 'recipient' | 'volunteer';
export type StatusType = 'uncomfirmed' | 'confirmed' | 'activated' | 'verified';
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
