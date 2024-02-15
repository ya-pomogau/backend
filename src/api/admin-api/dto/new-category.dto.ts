import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { CreateCategoryDto } from '../../../common/dto/category.dto';
import { UserStatus } from '../../../common/types/user.types';

export class ApiCreateCategoryDto implements CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Max(UserStatus.VERIFIED)
  @Min(UserStatus.CONFIRMED)
  accessLevel: UserStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  points: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;
}
