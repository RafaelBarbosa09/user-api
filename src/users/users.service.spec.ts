import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { IUsersRepository } from './users.repository.interface';
import { UsersMapper } from './mappers/users.mapper';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepositoryMock: Partial<IUsersRepository>;

  beforeEach(async () => {
    usersRepositoryMock = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersMapper,
        {
          provide: 'IUsersRepository',
          useValue: usersRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
