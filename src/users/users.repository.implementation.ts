import { Injectable } from '@nestjs/common';
import { IUsersRepository } from './users.repository.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';

@Injectable()
export class UsersRepositoryImplementation implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    return await this.ormRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.ormRepository.find();
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.ormRepository.findOne({ where: { id } });
    if (!user) return null;

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.ormRepository.findOne({ where: { email } });
    if (!user) return null;

    return user;
  }
}
