import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(@InjectModel('Contact') private ContactModel: Model<Contact>) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const createdContact = new this.ContactModel(createContactDto);
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
