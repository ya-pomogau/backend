import { Volunteer } from './entities/volunteers.entity';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { VolunteerService } from './volunteer.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Controller('volunteers')
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  @Get()
  async findAll(): Promise<Volunteer[]> {
    return await this.volunteerService.findAll();
  }

  @Post()
  async createVolunteer(
    @Body(new ValidationPipe()) volunteerData: CreateVolunteerDto,
  ): Promise<any> {
    try {
      return await this.volunteerService.createVolunteer(volunteerData);
    } catch (error) {
      // Если возникло исключение в результате некорректных данных
      // обработаем его и вернем сообщение об ошибке с соответствующим статусом
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Volunteer | undefined> {
    console.log('Handling getUserById', id);
    const objectId = new ObjectId(id);
    return this.volunteerService.findVolunteerById(objectId);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const objectId = new ObjectId(id);
    console.log('deleted');
    await this.volunteerService.deleteUserById(objectId);
  }
}
