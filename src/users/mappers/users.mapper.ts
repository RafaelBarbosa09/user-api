import { Injectable } from '@nestjs/common';
import { BaseMapper } from './base.mapper';
import { User } from '../entities/users.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersMapper extends BaseMapper<
  User,
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto
> {
  toEntity(dto: CreateUserDto | UpdateUserDto): User {
    const user = new User();
    if (dto.username) user.username = dto.username;
    if (dto.email) user.email = dto.email;
    if (dto.password) user.password = dto.password;

    return user;
  }

  toDto(entity: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = entity.id;
    dto.username = entity.username;
    dto.email = entity.email;
    return dto;
  }
}
