import {ApiProperty} from "@nestjs/swagger";
import {IsString, Length} from "class-validator";

export class CreateMainAdminDto {
    @ApiProperty({example: 'username', description: 'username'})
    @IsString({message: 'Должно быть строкой'})
    readonly username: string;
    
    @ApiProperty({example: '12345', description: 'пароль'})
    @IsString({message: 'Должно быть строкой'})
    @Length(4, 16, {message: 'Не меньше 4 и не больше 16'})
    readonly password: string;
}
