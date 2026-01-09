import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';

@Injectable()
export class HistoriaClinicaService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateHistoriaClinicaDto) {
    const existing = await this.prisma.historiaClinica.findUnique({
      where: { pacienteId: data.pacienteId },
    });
    if (existing) {
      throw new BadRequestException('El paciente ya tiene una historia clínica');
    }

    return this.prisma.historiaClinica.create({
      data,
      include: { paciente: true },
    });
  }

  async findByPaciente(pacienteId: number) {
    return this.prisma.historiaClinica.findUnique({
      where: { pacienteId },
      include: { paciente: true, registros: true },
    });
  }

  async findAll() {
    return this.prisma.historiaClinica.findMany({
      include: { paciente: true, registros: true },
    });
  }

  // La historia clínica no tiene delete, por regla de negocio
}
