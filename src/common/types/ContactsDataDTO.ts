import mongoose from 'mongoose';
import { Contact } from '../../datalake/contacts/schemas/contact.schema';

export class ContactsDataDTO extends Contact {
  _id: mongoose.Types.ObjectId;
}
