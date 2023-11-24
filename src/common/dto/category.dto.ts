export type CreateCategoryDto = {
  title: string;
  points: number;
  Level: number;
};

export type UpdateCategoryDto = Partial<CreateCategoryDto> & {
  _id?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};
