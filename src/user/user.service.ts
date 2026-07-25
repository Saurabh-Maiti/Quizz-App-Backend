import { BadRequestException, Injectable } from '@nestjs/common';
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
  ) {
  }
  async createUser(createUserDto: CreateUserDto){
    const role = await this.roleRepository.findOne({
      where: { id: createUserDto.role_id },
    });

    if (!role) {
      throw new BadRequestException('Invalid role_id');
    }
    const password= Math.random().toString(36).slice(-8); // Generate a random password
    const hashedPassword = await bcrypt.hash(password, 10);
    const savedUser = this.userRepository.create({
      firstName: createUserDto.first_name,
      lastName: createUserDto.last_name,
      email: createUserDto.email,
      hashedPassword,
      role,
    });

    await this.userRepository.save(savedUser);
    return savedUser;
  }
}
