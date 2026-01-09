import { IsInt } from 'class-validator';

export class CreateHistoriaClinicaDto {
  @IsInt()
  pacienteId: number;
}
