import { MongoRepository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
export declare class ContactsService {
    private readonly contactsRepository;
    constructor(contactsRepository: MongoRepository<Contact>);
    create(createContactDto: CreateContactDto): Promise<Contact>;
    find(): Promise<Contact>;
    update(updateContactDto: UpdateContactDto): Promise<{
        email: string;
        social: string[];
        _id: import("bson").ObjectId;
        createdAt: Date;
        updatedAt: Date;
    } & Contact>;
}
