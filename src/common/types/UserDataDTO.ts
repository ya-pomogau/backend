import { IUser } from '../../datalake/users/schemas/user.schema';

export interface UserDataDTO extends IUser {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
