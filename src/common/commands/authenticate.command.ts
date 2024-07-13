import { Volunteer } from '../../datalake/users/schemas/volunteer.schema';
import { Recipient } from '../../datalake/users/schemas/recipient.schema';
import { Admin } from '../../datalake/users/schemas/admin.schema';

export class AuthenticateCommand {
  constructor(public readonly dto: Record<string, unknown> | Volunteer | Recipient | Admin) {}
}
