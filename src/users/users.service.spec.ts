import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { IUsersRepository } from './users.repository.interface';
import { UsersMapper } from './mappers/users.mapper';
import { UserAlreadyExistsError } from './errors/UserAlreadyExistsError';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/users.entity';
import { UserResponseDto } from './dto/user-response.dto';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepositoryMock: Partial<IUsersRepository>;
  let usersMapperMock: Partial<UsersMapper>;
  let createUserDto: CreateUserDto;
  let userEntity: User;
  let userResponseDto: UserResponseDto;

  beforeEach(async () => {
    usersRepositoryMock = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };

    usersMapperMock = {
      toEntity: jest.fn(),
      toDto: jest.fn(),
    };

    createUserDto = {
      username: 'John Doe',
      email: 'johndoe@email.com',
      password: 'password123',
    };

    userEntity = {
      id: '1',
      ...createUserDto,
    };

    userResponseDto = {
      id: '1',
      username: 'John Doe',
      email: 'johndoe@email.com',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersMapper,
          useValue: usersMapperMock,
        },
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

  it('should be able to create a user successfully', async () => {
    usersRepositoryMock.create = jest.fn().mockResolvedValue(userEntity);
    usersMapperMock.toEntity = jest.fn().mockReturnValue(userEntity);
    usersMapperMock.toDto = jest.fn().mockReturnValue(userResponseDto);

    const result = await service.create(createUserDto);

    expect(usersRepositoryMock.create).toHaveBeenCalledWith(userEntity);
    expect(usersMapperMock.toEntity).toHaveBeenCalledWith(createUserDto);
    expect(usersMapperMock.toDto).toHaveBeenCalledWith(userEntity);
    expect(result).toEqual(userResponseDto);
  });

  it('should return an error if email already exists', async () => {
    usersRepositoryMock.findByEmail = jest.fn().mockResolvedValue(userEntity);
    usersMapperMock.toEntity = jest.fn().mockReturnValue(userEntity);
    usersMapperMock.toDto = jest.fn().mockReturnValue(userEntity);

    await expect(service.create(createUserDto)).rejects.toThrow(
      new UserAlreadyExistsError('User already exists'),
    );

    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledWith(
      userEntity.email,
    );
    
    expect(usersMapperMock.toEntity).toHaveBeenCalledWith(createUserDto);
    expect(usersRepositoryMock.create).not.toHaveBeenCalled();
    expect(usersMapperMock.toDto).not.toHaveBeenCalled();
  });
});
