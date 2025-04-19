import { Injectable } from '@nestjs/common';
import { BaseMapper } from './base.mapper';
import { User } from '../entities/users.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UsersMapper extends BaseMapper<
  User,
  CreateUserDto,
  UserResponseDto
> {
  toEntity(dto: CreateUserDto): User {
    const user = new User();
    user.username = dto.username;
    user.email = dto.email;
    user.password = dto.password;
    return user;
  }

  toDto(entity: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.username = entity.username;
    dto.email = entity.email;
    return dto;
  }
}
