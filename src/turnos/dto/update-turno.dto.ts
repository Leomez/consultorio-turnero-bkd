import { PartialType } from '@nestjs/mapped-types';
import { CreateTurnoDto } from './create-turno.dto';
import { Estado } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {
    @IsOptional()
    @IsEnum(Estado)
    estado?: Estado;
}
