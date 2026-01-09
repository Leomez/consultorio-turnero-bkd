import { IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateHistoriaRegistroDto {
  @IsNotEmpty()
  diagnostico: string;

  @IsNotEmpty()
  tratamiento: string;

  @IsOptional()
  observaciones?: string;

  @IsInt()
  historiaId: number;

  @IsInt()
  odontologoId: number;
}
