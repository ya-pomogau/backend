import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePoliticDto } from './dto/create-politic.dto';
import { UpdatePoliticDto } from './dto/update-politic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Politic } from './entities/politic.entity';
import { MongoRepository } from 'typeorm';
import exceptions from '../common/constants/exceptions';

@Injectable()
export class PoliticsService {
  constructor(
    @InjectRepository(Politic)
    private readonly politicRepository: MongoRepository<Politic>
  ) {}
  async create(createPoliticDto: CreatePoliticDto) {
    const alreadyCreated = await this.politicRepository.findOne({});

    if (alreadyCreated) {
      throw new ForbiddenException(exceptions.politic.alreadyCreated);
    }

    const politic = this.politicRepository.create(createPoliticDto);
    return this.politicRepository.save(politic);
  }

  async find() {
    return this.politicRepository.findOne({});
  }

  async update(updatePoliticDto: UpdatePoliticDto) {
    const politic = await this.find();
    return this.politicRepository.save({ ...politic, ...updatePoliticDto });
  }
}
