import { DataSource, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Task } from '../tasks/entities/task.entity';
export declare class CategoriesService {
    private readonly categoryRepository;
    private readonly taskRepository;
    private readonly dataSource;
    constructor(categoryRepository: Repository<Category>, taskRepository: Repository<Task>, dataSource: DataSource);
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    findAll(): Promise<Category[]>;
    findById(id: string): Promise<Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
}
