import { Injectable } from '@nestjs/common';
import { ContactsRepository } from '../../datalake/contacts/contacts.repository';
import { ContactsInterface } from '../../common/types/contacts.types';
import { UpdateContactsRequestDto } from '../../common/dto/contacts.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly contactsRepo: ContactsRepository) {}

  public async update(id: string, dto: UpdateContactsRequestDto): Promise<ContactsInterface> {
    return this.contactsRepo.findByIdAndUpdate(id, dto, {});
  }

  public async getActual(): Promise<ContactsInterface> {
    return this.contactsRepo.findOne({}, {}, { sort: { createdAt: -1 } });
  }
}
