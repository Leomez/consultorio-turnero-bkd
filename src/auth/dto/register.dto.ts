import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum, Matches } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
    @IsNotEmpty({ message: 'El nombre es requerido' })
    nombre: string;

    @IsEmail({}, { message: 'Email inválido' })
    email: string;

    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        { message: 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales' }
    )
    password: string;

    @IsOptional()
    @IsEnum(Role, { message: 'Rol inválido' })
    role?: Role;
}
