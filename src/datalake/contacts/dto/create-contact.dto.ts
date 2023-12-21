import { ContactsInterface } from '../../../common/types/contacts.types';

export type CreateContactDto = Omit<ContactsInterface, 'expiredAt' | 'createdAt'>;
