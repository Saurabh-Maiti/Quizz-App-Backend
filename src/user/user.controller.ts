import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Post('/create')
    async createUser(@Body()dto: CreateUserDto){
        const respone =await this.userService.createUser(dto);
        return respone;
    }
}
