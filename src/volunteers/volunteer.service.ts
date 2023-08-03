import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Volunteer } from './entities/volunteers.entity';
import { ObjectId } from 'mongodb';
import { NotFoundException } from '@nestjs/common/exceptions';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { VolunteerStatus } from './dto/create-volunteer.dto';

@Injectable()
export class VolunteerService {
  constructor(
    @InjectRepository(Volunteer)
    private readonly volunteersRepository: Repository<Volunteer>,
  ) {}

  async findAll(): Promise<Volunteer[]> {
    return this.volunteersRepository.find();
  }

  async createVolunteer(volunteerData: CreateVolunteerDto): Promise<Volunteer> {
    // Устанавливаем значение поля status на VolunteerStatus.NOT_APPROVED по умолчанию
    volunteerData.status = VolunteerStatus.NOT_APPROVED;
    const newVolunteer = this.volunteersRepository.create(volunteerData);
    return this.volunteersRepository.save(newVolunteer);
  }

  async getVolunteerByVolunteername(fullname: string) {
    const volunteer = await this.volunteersRepository.findOneBy({ fullname });
    return volunteer;
  }

  async deleteUserById(id: ObjectId): Promise<void> {
    await this.volunteersRepository.delete(id);
  }

  async findVolunteerById(_id: ObjectId): Promise<Volunteer | undefined> {
    const volunteer = await this.volunteersRepository.findOne({
      where: { _id },
    });
    if (!volunteer) {
      throw new NotFoundException('Volunteer not found');
    }
    return volunteer;
  }

  async updateOne(_id: ObjectId, updateVolunteerDto: UpdateVolunteerDto) {
    const volunteer = await this.volunteersRepository.findOne({
      where: { _id },
    });
    if (!volunteer) {
      // Если объект Volunteer с указанным id не найден, можно бросить исключение
      throw new Error('Volunteer not found');
    }
    volunteer.fullname = updateVolunteerDto.fullname;
    volunteer.role = updateVolunteerDto.role;
    volunteer.vk = updateVolunteerDto.vk;
    volunteer.photo = updateVolunteerDto.photo;
    volunteer.phone = updateVolunteerDto.phone;
    volunteer.address = updateVolunteerDto.address;
    volunteer.coordinates = updateVolunteerDto.coordinates;

    await this.volunteersRepository.save(volunteer);
    return volunteer;
  }
}
