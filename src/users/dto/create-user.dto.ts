import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
    @IsNotEmpty()
    nombre: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;

}