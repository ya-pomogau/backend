import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import exceptions from '../../src/common/constants/exceptions';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactsRepository: MongoRepository<Contact>
  ) {}

  async create(createContactDto: CreateContactDto) {
    const alreadyCreated = await this.contactsRepository.findOne({});

    if (alreadyCreated) {
      throw new ForbiddenException(exceptions.contacts.alreadyCreated);
    }

    const contacts = this.contactsRepository.create(createContactDto);
    return this.contactsRepository.save(contacts);
  }

  async find() {
    return this.contactsRepository.findOne({});
  }

  async update(updateContactDto: UpdateContactDto) {
    const contacts = await this.find();
    return this.contactsRepository.save({ ...contacts, ...updateContactDto });
  }
}
