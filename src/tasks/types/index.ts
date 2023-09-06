/* eslint-disable no-shadow */

import { ApiProperty } from '@nestjs/swagger';

export class TaskConfirmation {
  @ApiProperty()
  recipient: boolean | null;

  @ApiProperty()
  volunteer: boolean | null;
}

export enum TaskStatus {
  CREATED = 'created',
  ACCEPTED = 'accepted',
  CLOSED = 'closed',
}
