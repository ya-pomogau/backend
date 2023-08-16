export interface ITaskConfirmation {
  recipient: boolean | null;
  volunteer: boolean | null;
}

export enum TaskStatus {
  CREATED = 'created',
  ACCEPTED = 'accepted',
  CLOSED = 'closed',
}
