import { User } from './entities/users.entity';

export interface IUsersRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
