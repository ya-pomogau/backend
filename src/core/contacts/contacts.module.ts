import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsRepositoryModule } from '../../datalake/contacts/contacts-repository.module';

@Module({
  imports: [ContactsRepositoryModule],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
