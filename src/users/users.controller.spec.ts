import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersMapper } from './mappers/users.mapper';
import { IUsersRepository } from './users.repository.interface';

describe('UsersController', () => {
  let controller: UsersController;
  let usersRepositoryMock: Partial<IUsersRepository>;

  beforeEach(async () => {
    usersRepositoryMock = {
      create: jest.fn(),
    };

    const hashingServiceMock = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        UsersMapper,
        {
          provide: 'IUsersRepository',
          useValue: usersRepositoryMock,
        },
        {
          provide: 'IHashingService',
          useValue: hashingServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
