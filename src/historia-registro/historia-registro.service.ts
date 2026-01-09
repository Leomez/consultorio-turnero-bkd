import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHistoriaRegistroDto } from './dto/create-historia-registro.dto';
import { UpdateHistoriaRegistroDto } from './dto/update-historia-registro.dto';

@Injectable()
export class HistoriaRegistroService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateHistoriaRegistroDto) {
    return this.prisma.historiaRegistro.create({
      data,
      include: { historia: true, odontologo: true },
    });
  }

  async findByHistoria(historiaId: number) {
    return this.prisma.historiaRegistro.findMany({
      where: { historiaId },
      include: { odontologo: true },
      orderBy: { fecha: 'desc' },
    });
  }

  async findOne(id: number) {
    const registro = await this.prisma.historiaRegistro.findUnique({
      where: { id },
      include: { odontologo: true, historia: true },
    });
    if (!registro) throw new NotFoundException('Registro no encontrado');
    return registro;
  }

  async update(id: number, data: UpdateHistoriaRegistroDto) {
    return this.prisma.historiaRegistro.update({
      where: { id },
      data,
      include: { odontologo: true, historia: true },
    });
  }

  // delete físico no, pero podrías implementar "anulación"
}
