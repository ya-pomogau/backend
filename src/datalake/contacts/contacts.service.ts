import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
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
    const now = Date.now();
    if (await this.isContactsExist()) {
      await this.ContactModel.updateOne({ expiredAt: null }, { expiredAt: now });
    }
    const createdContact = new this.ContactModel({
      ...createContactDto,
      createdAt: now,
    });
    const savedContact = await createdContact.save();
    return savedContact.toObject();
  }

  async getContactsHistory(): Promise<Contact[]> {
    return this.ContactModel.find().lean().exec();
  }

  async getCurrentContact(): Promise<Contact> {
    return this.ContactModel.findOne({ expiredAt: null }).lean().exec();
  }

  async findOne(id: mongoose.Schema.Types.ObjectId): Promise<Contact> {
    return this.ContactModel.findById(id).lean().exec();
  }
}
