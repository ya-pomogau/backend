import { IContact } from '../schemas/contact.schema';

export class CreateContactDto implements Omit<IContact, 'expiredAt' | 'createdAt'> {
  email: string;

  socialNetwork: string;
}
