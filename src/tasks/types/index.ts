import { ApiProperty } from '@nestjs/swagger';

export class TaskConfirmation {
  @ApiProperty()
  recipient: boolean | null;

  @ApiProperty()
  volunteer: boolean | null;
}

// eslint-disable-next-line no-shadow
export enum TaskStatus {
  CREATED = 'created',
  ACCEPTED = 'accepted',
  CLOSED = 'closed',
}
