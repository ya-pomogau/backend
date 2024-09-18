import { ApiProperty } from '@nestjs/swagger';

class AuthorDto {
  @ApiProperty({ example: 'name4', description: 'Имя автора', required: true })
  name: string;

  @ApiProperty({ example: '+79203332233', description: 'Телефон автора', required: true })
  phone: string;

  @ApiProperty({ example: 'new adress2', description: 'Адрес автора', required: true })
  address: string;

  @ApiProperty({ example: 'https://kspshnik.com/pub/img/brienzersee_pre.jpg', description: 'Аватар автора', required: false })
  avatar?: string;
}

export class CreatedPostDto {
  @ApiProperty({ example: 'Благотворительность в рекламе', description: 'Заголовок блога', required: true })
  title: string;

  @ApiProperty({
    example: 'Благотворительность в рекламеБлаготворительность в рекламе...',
    description: 'Текст блога',
    required: true,
  })
  text: string;

  @ApiProperty({ type: AuthorDto, description: 'Автор блога', required: true })
  author: AuthorDto;

  @ApiProperty({ example: [], description: 'Файлы, связанные с блогом', required: false, type: [String] })
  files?: string[];
}
