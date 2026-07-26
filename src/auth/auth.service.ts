import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.findUserByEmail(loginUserDto.email);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.hashedPassword,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }
    const { hashedPassword, ...sanitizedUser } = user;
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1d');
    await this.redisService.set(
      `session:${user.id}`,
      accessToken,
      this.getJwtTtlSeconds(expiresIn),
    );
    return {
      access_token: accessToken,
      user: sanitizedUser,
    };
  }
  async firstPasswordChange(email: string, newPassword: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.hashedPassword = hashedPassword;
    user.isOnboarded = true;
    await this.userService.updateUser(user);
  }

  private getJwtTtlSeconds(expiresIn: string): number | undefined {
    const match = expiresIn.match(/^(\d+)([smhd])?$/);
    if (!match) {
      return undefined;
    }

    const value = Number(match[1]);
    const unit = match[2] ?? 's';
    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 60 * 60,
      d: 24 * 60 * 60,
    };

    return value * multipliers[unit];
  }
}
