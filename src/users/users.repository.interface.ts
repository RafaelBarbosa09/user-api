import { User } from './entities/users.entity';

export interface IUsersRepository {
  create(user: User): Promise<User>;
}
