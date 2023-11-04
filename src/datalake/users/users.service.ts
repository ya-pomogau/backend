import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common/exceptions';
import {
  AdminDataDTO,
  AdminDataDTOWithoutPassword,
  RecipientDataDTO,
  UserDataDTO,
  VolunteerDataDTO,
} from '../../common/types/UsersDataDTO';
import { HashService } from '../../common/hash/hash.service';
import { User } from './schemas/user.schema';
import { PointGeoJSON } from '../../common/schemas/PointGeoJSON.schema';
import { UserRole } from '../../common/types/user.types';
import exceptions from '../../common/constants/exceptions';
import { AdminRole } from './schemas/admin.schema';
import { VolunteerRole } from './schemas/volunteer.schema';
import { RecipientRole } from './schemas/recipient.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(AdminRole.name) private AdminModel: Model<AdminRole>,
    @InjectModel(VolunteerRole.name) private VolunteerModel: Model<VolunteerRole>,
    @InjectModel(RecipientRole.name) private RecipientModel: Model<RecipientRole>,
    private hashService: HashService
  ) {}

  async create(createUserDto: AdminDataDTO): Promise<AdminDataDTOWithoutPassword> {
    const hashedPassword = this.hashService.generateHash(createUserDto.administrative.password);
    const createdUser = new this.AdminModel({
      ...createUserDto,
      administrative: {
        ...createUserDto.administrative,
        password: hashedPassword,
      },
    });
    const savedUser = await createdUser.save();

    return savedUser.toObject();
  }

  async findAll(): Promise<User[]> {
    return this.UserModel.find().lean().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.UserModel.findById(id)
      .orFail(new NotFoundException(exceptions.users.notFound))
      .lean()
      .exec();
  }

  async update(params: FilterQuery<UserDataDTO>, updateUserDto: Partial<UserDataDTO>) {
    return this.UserModel.updateOne(params, updateUserDto)
      .orFail(new NotFoundException(exceptions.users.notFound))
      .lean()
      .exec();
  }

  async remove(params: FilterQuery<UserDataDTO>) {
    return this.UserModel.deleteOne(params)
      .orFail(new NotFoundException(exceptions.users.notFound))
      .lean()
      .exec();
  }

  async findVolunteerWithin(center: PointGeoJSON, distance: number): Promise<VolunteerDataDTO[]> {
    const volunteers = await this.VolunteerModel.find({
      location: {
        $geoWithin: { $center: [[...center.coordinates], distance] },
      },
      role: UserRole.VOLUNTEER,
    });
    return volunteers;
  }

  async checkAdminCredentials(login: string, password: string): Promise<AdminDataDTO> | null {
    let comparePassword: boolean;
    const admin = await this.AdminModel.findOne({
      role: UserRole.ADMIN,
      administrative: { login },
    });
    if (admin) {
      comparePassword = await this.hashService.compareHash(password, admin.administrative.password);
    }
    if (comparePassword) {
      return admin.toObject();
    }
    return null;
  }

  async checkVKCredentials(vkID: number): Promise<RecipientDataDTO> | null {
    const user = await this.RecipientModel.findOne({
      role: { $in: [UserRole.RECIPIENT, UserRole.VOLUNTEER] },
      vkID,
    });
    return user ? user.toObject() : null;
  }
}