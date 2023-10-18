import mongoose from 'mongoose';
import { CreateContactDto } from '../../datalake/contacts/dto/create-contact.dto';

export class ContactsDataDTO extends CreateContactDto {
  _id: mongoose.Types.ObjectId;
}
