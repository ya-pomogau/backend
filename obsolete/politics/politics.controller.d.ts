import { PoliticsService } from './politics.service';
import { CreatePoliticDto } from './dto/create-politic.dto';
import { UpdatePoliticDto } from './dto/update-politic.dto';
import { Politic } from './entities/politic.entity';
export declare class PoliticsController {
    private readonly politicsService;
    constructor(politicsService: PoliticsService);
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
