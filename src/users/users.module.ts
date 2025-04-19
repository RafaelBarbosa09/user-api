import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersMapper } from './mappers/users.mapper';
import { UsersRepositoryImplementation } from './users.repository.implementation';

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
  ],
})
export class UsersModule {}
