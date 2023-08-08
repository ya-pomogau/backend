import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { CreateMainAdminDto } from './dto/create-main-admin.dto';
import { MainAdmin } from './main-admin.model';

@Injectable()
export class MainAdminService {
  constructor(@InjectModel(MainAdmin) private MainAdminRepository: typeof MainAdmin) { }

  async authorization(dto: CreateMainAdminDto) {
    const user = await this.MainAdminRepository.create(dto);
    return user;
  }
}