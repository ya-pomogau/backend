import { Test, TestingModule } from '@nestjs/testing';
import { AdminApiController } from './admin-api.controller';
import { UsersService } from '../../core/users/users.service';

const mockUserId = '6660147b30646b68ad1b41fb';

describe('AdminApiController', () => {
  const userDataMock = {
    _id: 'mockUserId',
    score: 0,
    status: 1,
    location: {
      type: 'Point',
      coordinates: [55.544998, 37.073382],
      createdAt: '2024-06-05T07:32:11.667Z',
      updatedAt: '2024-06-05T07:32:11.667Z',
      id: '6660147b30646b68ad1b41fc',
    },
    keys: false,
    address: 'Московская область, Наро-Фоминский городской округ, Апрелевка',
    avatar: 'https://sun1-88.userapi.com',
    name: 'Иван Иванов',
    phone: '+79054444444',
    vkId: '888888888',
    role: 'Recipient',
    createdAt: '2024-06-05T07:32:11.667Z',
    updatedAt: '2024-06-05T07:32:11.667Z',
  };

  const usersServiceMock = jest.fn(() => ({
    getProfile: jest.fn(() => userDataMock),
  }));

  let adminApiController: AdminApiController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminApiController],
      providers: [
        {
          provide: UsersService,
          useFactory: usersServiceMock,
        },
      ],
    }).compile();

    adminApiController = module.get<AdminApiController>(AdminApiController);
    usersService = module.get<UsersService>(UsersService);
  });

  it.skip('.getTasks() should call getProfile method of the service', () => {
    jest.spyOn(usersService, 'getProfile');

    adminApiController.getTasks(mockUserId);

    expect(usersService.getProfile).toHaveBeenCalledWith(mockUserId);
  });
});
