import { CreatePoliticDto } from './dto/create-politic.dto';
import { UpdatePoliticDto } from './dto/update-politic.dto';
import { Politic } from './entities/politic.entity';
import { MongoRepository } from 'typeorm';
export declare class PoliticsService {
    private readonly politicRepository;
    constructor(politicRepository: MongoRepository<Politic>);
    create(createPoliticDto: CreatePoliticDto): Promise<Politic>;
    find(): Promise<Politic>;
    update(updatePoliticDto: UpdatePoliticDto): Promise<{
        title: string;
        text: string;
        _id: import("bson").ObjectId;
        createdAt: Date;
        updatedAt: Date;
    } & Politic>;
}
