import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Contacts } from './schemas/contact.schema';
import { BaseRepositoryService } from '../base-repository/base-repository.service';

@Injectable()
export class ContactsRepository extends BaseRepositoryService<Contacts> {
  constructor(@InjectModel(Contacts.name) private contactsModel: Model<Contacts>) {
    super(contactsModel);
  }
}
