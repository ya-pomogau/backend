import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
export declare class ContactsController {
    private readonly contactsService;
    constructor(contactsService: ContactsService);
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
