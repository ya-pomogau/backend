import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import exceptions from '../../common/constants/exceptions';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './schemas/contact.schema';

@Injectable()
export class ContactsService {
  constructor(@InjectModel(Contact.name) private ContactModel: Model<Contact>) {}

  private async isContactsExist(): Promise<boolean> {
    const count = await this.ContactModel.countDocuments().exec();
    return Promise.resolve(count > 0);
  }

  async create(createContactDto: CreateContactDto): Promise<CreateContactDto> {
    if (await this.isContactsExist()) {
      await this.ContactModel.updateOne({ expiredAt: null }, { expiredAt: Date.now() });
    }
    const createdContact = new this.ContactModel(createContactDto);
    const savedContact = await createdContact.save();
    return savedContact.toObject();
  }

  async getContactsHistory(): Promise<Contact[]> {
    return this.ContactModel.find().lean().exec();
  }

  async getCurrentContact(): Promise<Contact> {
    return this.ContactModel.findOne({ expiredAt: null }).lean().exec();
  }

  async findOne(id: string): Promise<Contact> {
    return this.ContactModel.findById(id)
      .orFail(new Error(exceptions.users.notFound))
      .lean()
      .exec();
  }
}
