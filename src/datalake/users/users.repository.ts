import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

import { BaseRepositoryService } from '../base-repository/base-repository.service';

@Injectable()
export class UsersRepository extends BaseRepositoryService<User> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super(userModel);
  }
}
/* constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Admin.name) private AdminModel: Model<Admin>,
    @InjectModel(VolunteerRole.name) private VolunteerModel: Model<VolunteerRole>,
    @InjectModel(RecipientRole.name) private RecipientModel: Model<RecipientRole>,
    private hashService: HashService
  ) {}

  _createAdmin(createAdminDto: AdminDataDTO): HydratedDocument<Admin> {
    const hashedPassword = this.hashService.generateHash(createAdminDto.administrative.password);
    return new this.AdminModel({
      ...createAdminDto,
      administrative: {
        ...createAdminDto.administrative,
        password: hashedPassword,
      },
    });
  }

  _createVolunteer(createVolunteerDto: VolunteerDataDTO): HydratedDocument<VolunteerRole> {
    return new this.VolunteerModel(createVolunteerDto);
  }

  _createRecipient(createRecipientDto: RecipientDataDTO): HydratedDocument<RecipientRole> {
    return new this.RecipientModel(createRecipientDto);
  }

  async create(
    createUserDto: AdminDataDTO | VolunteerDataDTO | RecipientDataDTO
  ): Promise<AdminDataDTOWithoutPassword | VolunteerDataDTO | RecipientDataDTO | null> {
    let createdUser: HydratedDocument<RecipientRole | VolunteerRole | Admin>;
    switch (createUserDto.role) {
      case UserRole.ADMIN:
        createdUser = this._createAdmin(createUserDto as AdminDataDTO);
        break;
      case UserRole.RECIPIENT:
        createdUser = this._createRecipient(createUserDto as RecipientDataDTO);
        break;
      case UserRole.VOLUNTEER:
        createdUser = this._createVolunteer(createUserDto as VolunteerDataDTO);
        break;
      default:
        return null;
    }

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

  async checkVKCredentials(vkID: number): Promise<RecipientDataDTO | VolunteerDataDTO> | null {
    const user = await this.UserModel.findOne({
      role: { $in: [UserRole.RECIPIENT, UserRole.VOLUNTEER] },
      vkID,
    });
    return user ? user.toObject() : null;
  }

  */
