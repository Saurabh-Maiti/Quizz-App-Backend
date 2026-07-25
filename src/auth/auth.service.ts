import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}
    async login(loginUserDto:LoginUserDto){
        const user=await this.userService.findUserByEmail(loginUserDto.email);
        if(!user){
            throw new BadRequestException('Invalid email or password');
        }
        const isPasswordValid=await bcrypt.compare(loginUserDto.password, user.hashedPassword);
        if(!isPasswordValid){
            throw new BadRequestException('Invalid email or password');
        }
        const {hashedPassword,...sanitizedUser}=user;
        return sanitizedUser;
    }
    async firstPasswordChange(email:string,newPassword:string){
        const user=await this.userService.findUserByEmail(email);
        if(!user){
            throw new BadRequestException('User not found');
        }
        const hashedPassword=await bcrypt.hash(newPassword,10);
        user.hashedPassword=hashedPassword;
        await this.userService.updateUser(user);
    }   
}
