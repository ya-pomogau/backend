import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { CreateCategoryDto } from '../../../common/dto/category.dto';
import { UserStatus } from '../../../common/types/user.types';

export class ApiCreateCategoryDto implements CreateCategoryDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Max(UserStatus.VERIFIED)
  @Min(UserStatus.CONFIRMED)
  accessLevel: UserStatus;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  points: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
}
