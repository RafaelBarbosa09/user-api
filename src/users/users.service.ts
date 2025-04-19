import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersMapper } from './mappers/users.mapper';
import { IUsersRepository } from './users.repository.interface';
import { UserResponseDto } from './dto/user-response.dto';
import { UserAlreadyExistsError } from './errors/UserAlreadyExistsError';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository')
    private readonly repository: IUsersRepository,
    private readonly mapper: UsersMapper,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const userEntity = this.mapper.toEntity(createUserDto);

    const existingUser = await this.repository.findByEmail(createUserDto.email);
    if (existingUser) throw new UserAlreadyExistsError('User already exists');

    const result = await this.repository.create(userEntity);

    return this.mapper.toDto(result);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const usersEntity = await this.repository.findAll();
    return this.mapper.toDtoArray(usersEntity);
  }

  async findById(id: string): Promise<UserResponseDto | null> {
    const userEntity = await this.repository.findById(id);
    if (!userEntity) return null;

    return this.mapper.toDto(userEntity);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
