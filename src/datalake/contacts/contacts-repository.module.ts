import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactsRepository } from './contacts.repository';
import { Contacts, ContactSchema } from './schemas/contact.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Contacts.name, schema: ContactSchema }])],
  providers: [ContactsRepository],
  exports: [ContactsRepository],
})
// eslint-disable-next-line prettier/prettier
export class ContactsRepositoryModule {}
