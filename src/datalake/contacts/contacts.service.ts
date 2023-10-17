import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(@InjectModel('Contact') private ContactModel: Model<Contact>) {}

  private async isContactsExist(): Promise<boolean> {
    const count = await this.ContactModel.countDocuments().exec();
    return Promise.resolve(count > 0);
  }

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const now = Date.now();
    if (await this.isContactsExist()) {
      await this.ContactModel.updateOne(
        { expiredAt: null },
        { expiredAt: now }
      );
    }
    const createdContact = new this.ContactModel({
      ...createContactDto,
      createdAt: now,
    });
    const savedContact = await createdContact.save();
    return savedContact.toObject();
  }

  async findAll(): Promise<Contact[]> {
    return this.ContactModel.find().lean().exec();
  }

  async findOne(id: number): Promise<Contact> {
    return this.ContactModel.findOne({ _id: id }).lean().exec();
  }

  async remove(id: number): Promise<Contact> {
    return this.ContactModel.findOneAndDelete({ _id: id }).lean().exec();
  }
}
