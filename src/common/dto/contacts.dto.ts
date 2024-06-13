import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';
import { ContactsInterface } from '../types/contacts.types';

export class UpdateContactsRequestDto implements ContactsInterface {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsUrl()
  @IsNotEmpty()
  socialNetwork: string;
}
