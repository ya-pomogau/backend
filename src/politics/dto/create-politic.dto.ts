import { IsNotEmpty, IsString } from "class-validator";
import validationOptions from "../../common/constants/validation-options";
import {ApiProperty} from "@nestjs/swagger";

export class CreatePoliticDto {
    @IsString({ message: validationOptions.messages.shouldBeString })
    @IsNotEmpty({ message: validationOptions.messages.isEmpty })
    @ApiProperty({ example: 'Благотворительность в рекламе' })
    title: string;

    @IsString({ message: validationOptions.messages.shouldBeString })
    @IsNotEmpty({ message: validationOptions.messages.isEmpty })
    @ApiProperty({
        example:
            'Реклама благотворительности встречается везде: от интернет-сайтов до уличных билбордов...',
    })
    text: string;
}
