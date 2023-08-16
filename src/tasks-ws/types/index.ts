import { Task } from '../../tasks/entities/task.entity';

export enum WsTasksEvents {
  CREATED = 'The new task was created',
  ACCEPTED = 'The task was accepted',
  REFUSED = 'The task was refused',
  CLOSED = 'The task was closed or deleted',
  UPDATED = 'the task was updated',
}
export type WsMessage = {
  event: WsTasksEvents;
  data: Task;
};
