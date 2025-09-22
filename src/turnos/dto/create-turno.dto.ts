import { IsDateString, IsInt, IsOptional, IsEnum, IsString } from 'class-validator';
import { Estado } from '@prisma/client';

export class CreateTurnoDto {
  @IsDateString()
  fecha: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsEnum(Estado)
  @IsOptional()
  estado?: Estado;

  @IsInt()
  pacienteId: number;

  @IsInt()
  odontologoId: number;
}
