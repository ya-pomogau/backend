import { UserStatus } from "src/users/types";

export class UpdateCategoryDto {
    title: string;
    points: number;
    accessLevel: UserStatus;
    createdAt: Date; 
    updatedAt: Date;
}