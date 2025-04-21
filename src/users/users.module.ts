import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersMapper } from './mappers/users.mapper';
import { UsersRepositoryImplementation } from './users.repository.implementation';
import { HashingService } from 'src/common/hashing/hashing.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersMapper,
    {
      provide: 'IUsersRepository',
      useClass: UsersRepositoryImplementation,
    },
    {
      provide: 'IHashingService',
      useClass: HashingService,
    },
  ],
})
export class UsersModule {}
