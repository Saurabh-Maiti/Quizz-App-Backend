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
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly emailService: EmailService,
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
    this.emailService.sendMail({
      to: createUserDto.email,
      subject: 'Welcome to Quiz App',
      text: `Hello ${createUserDto.first_name},\n\nYour account has been created successfully. Your temporary password is: ${password}\n\nPlease change your password after logging in.`,
    });
    const { hashedPassword, ...sanitizedUser } = savedUser;
    return sanitizedUser;
  }
  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: { role: true },
    });
    return user;
  }
  async updateUser(user: UserEntity) {
    await this.userRepository.save(user);
  }

  async getUserProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { role: true },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const { hashedPassword, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
