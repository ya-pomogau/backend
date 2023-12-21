import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { BaseRepositoryService } from '../base-repository/base-repository.service';

@Injectable()
export class TasksRepository extends BaseRepositoryService<Task> {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<Task>) {
    super(taskModel);
  }
}
