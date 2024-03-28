import { UserStatus } from "../types/user.types";

export type CreateCategoryDto = {
  title: string;
  points: number;
  accessLevel: UserStatus;
};

export type UpdateCategoryDto = Partial<CreateCategoryDto> & {
  _id?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};
