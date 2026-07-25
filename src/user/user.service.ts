import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/user.dto';
import { RoleEntity } from '../role/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const role = await this.roleRepository.findOne({
      where: { id: createUserDto.role_id },
    });

    if (!role) {
      throw new BadRequestException('Invalid role_id');
    }
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new ConflictException('User with this email already exists');
    }
    const password = Math.random().toString(36).slice(-8); // Generate a random password
    const hashed_Password = await bcrypt.hash(password, 10);
    const savedUser = this.userRepository.create({
      firstName: createUserDto.first_name,
      lastName: createUserDto.last_name,
      email: createUserDto.email,
      hashedPassword: hashed_Password,
      role,
    });

    await this.userRepository.save(savedUser);
    const { hashedPassword, ...sanitizedUser } = savedUser;
    return sanitizedUser;
  }
}
