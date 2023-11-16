import { IContact } from '../schemas/contact.schema';

export type CreateContactDto = Omit<IContact, 'expiredAt' | 'createdAt'>;
