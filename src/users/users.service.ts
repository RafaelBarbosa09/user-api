import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersMapper } from './mappers/users.mapper';
import { IUsersRepository } from './users.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository')
    private readonly repository: IUsersRepository,
    private readonly mapper: UsersMapper,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userEntity = this.mapper.toEntity(createUserDto);
    const result = await this.repository.create(userEntity);
    return this.mapper.toDto(result);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
