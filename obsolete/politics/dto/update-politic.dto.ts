import { PartialType } from '@nestjs/swagger';
import { CreatePoliticDto } from './create-politic.dto';

export class UpdatePoliticDto extends PartialType(CreatePoliticDto) {}
