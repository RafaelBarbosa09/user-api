import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersMapper } from './mappers/users.mapper';
import { IUsersRepository } from './users.repository.interface';
import { UserResponseDto } from './dto/user-response.dto';
import { UserAlreadyExistsError } from './errors/UserAlreadyExistsError';
import { UserNotFoundError } from './errors/UserNotFoundError';
import { InvalidInputDataError } from './errors/InvalidInputDataError';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository')
    private readonly repository: IUsersRepository,
    private readonly mapper: UsersMapper,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    if (!this.isValidInputData(createUserDto)) {
      throw new InvalidInputDataError('Invalid input data');
    }

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

  async findById(id: string): Promise<UserResponseDto> {
    const userEntity = await this.repository.findById(id);
    if (!userEntity) throw new UserNotFoundError('User not found');

    return this.mapper.toDto(userEntity);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const foundedUser = await this.repository.findById(id);
    if (!foundedUser) throw new UserNotFoundError('User not found');

    const userEntity = this.mapper.toEntity(updateUserDto);
    const updatedUser = await this.repository.update(id, userEntity);

    return this.mapper.toDto(updatedUser);
  }

  async remove(id: string): Promise<void> {  
    const foundedUser = await this.repository.findById(id);
    if (!foundedUser) throw new UserNotFoundError('User not found');

    await this.repository.delete(id);
  }

  private isValidInputData(createUserDto: CreateUserDto): boolean {
    return !!(
      createUserDto.username &&
      createUserDto.email &&
      createUserDto.password
    );
  }
}
