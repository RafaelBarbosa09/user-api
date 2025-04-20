import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { IUsersRepository } from './users.repository.interface';
import { UsersMapper } from './mappers/users.mapper';
import { UserAlreadyExistsError } from './errors/UserAlreadyExistsError';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/users.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { UserNotFoundError } from './errors/UserNotFoundError';
import { InvalidInputDataError } from './errors/InvalidInputDataError';

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

  describe('create', () => {
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

    it('should return an error if username is not passed', async () => {
      const invalidCreateUserDto = {
        username: '',
        email: 'johndoe@email.com',
        password: 'teste123',
      };

      await expect(service.create(invalidCreateUserDto)).rejects.toThrow(
        new InvalidInputDataError('Invalid input data'),
      );

      expect(usersMapperMock.toEntity).not.toHaveBeenCalled();
      expect(usersRepositoryMock.create).not.toHaveBeenCalled();
      expect(usersMapperMock.toDto).not.toHaveBeenCalled();
    });

    it('should return an error if email is not passed', async () => {
      const invalidCreateUserDto = {
        username: 'John Doe',
        email: '',
        password: 'teste123',
      };

      await expect(service.create(invalidCreateUserDto)).rejects.toThrow(
        new InvalidInputDataError('Invalid input data'),
      );

      expect(usersMapperMock.toEntity).not.toHaveBeenCalled();
      expect(usersRepositoryMock.create).not.toHaveBeenCalled();
      expect(usersMapperMock.toDto).not.toHaveBeenCalled();
    });

    it('should return an error if password is not passed', async () => {
      const invalidCreateUserDto = {
        username: 'John Doe',
        email: 'johndoe@email.com',
        password: '',
      };

      await expect(service.create(invalidCreateUserDto)).rejects.toThrow(
        new InvalidInputDataError('Invalid input data'),
      );

      expect(usersMapperMock.toEntity).not.toHaveBeenCalled();
      expect(usersRepositoryMock.create).not.toHaveBeenCalled();
      expect(usersMapperMock.toDto).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should be able to return an array of users', async () => {
      const usersEntity = [userEntity];
      const usersResponseDto = [userResponseDto];

      usersRepositoryMock.findAll = jest.fn().mockResolvedValue(usersEntity);
      usersMapperMock.toDtoArray = jest.fn().mockReturnValue(usersResponseDto);

      const result = await service.findAll();

      expect(usersRepositoryMock.findAll).toHaveBeenCalledTimes(1);
      expect(usersMapperMock.toDtoArray).toHaveBeenCalledWith(usersEntity);
      expect(result).toEqual(usersResponseDto);
    });
  });

  describe('findById', () => {
    it('should be able to return a user by id', async () => {
      usersRepositoryMock.findById = jest.fn().mockResolvedValue(userEntity);
      usersMapperMock.toDto = jest.fn().mockReturnValue(userResponseDto);

      await expect(service.findById(userEntity.id)).resolves.not.toThrow();
      expect(usersRepositoryMock.findById).toHaveBeenCalledWith(userEntity.id);
      expect(usersMapperMock.toDto).toHaveBeenCalledWith(userEntity);
    });

    it('should return an error if user not found', async () => {
      const nonExistingUserId = 'non-existing-id';

      usersRepositoryMock.findById = jest.fn().mockResolvedValue(null);

      await expect(service.findById(nonExistingUserId)).rejects.toThrow(
        new UserNotFoundError('User not found'),
      );

      expect(usersRepositoryMock.findById).toHaveBeenCalledWith(
        nonExistingUserId,
      );
    });
  });
});
