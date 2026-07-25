import { IsEmail, IsString, IsUUID } from "class-validator";

export class CreateUserDto {
    @IsString()
    first_name!: string;

    @IsString()
    last_name!: string;

    @IsEmail()
    email!: string

    @IsUUID()
    @IsString()
    role_id!: string
}
