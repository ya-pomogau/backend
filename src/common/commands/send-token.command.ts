import { Admin } from '../../datalake/users/schemas/admin.schema';
import { Recipient } from '../../datalake/users/schemas/recipient.schema';
import { Volunteer } from '../../datalake/users/schemas/volunteer.schema';

export class SendTokenCommand {
  constructor(
    public readonly user: Recipient | Admin | Volunteer | Record<string, unknown>,
    public readonly token: string
  ) {}
}
