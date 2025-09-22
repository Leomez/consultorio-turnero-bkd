import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

@Injectable()
export class TurnosService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateTurnoDto) {
        const existe = await this.prisma.turno.findFirst({
            where: {
                odontologoId: data.odontologoId,
                fecha: new Date(data.fecha),
            },
        });

        if (existe) {
            throw new BadRequestException('El odontólogo ya tiene un turno en ese horario');
        }

        return this.prisma.turno.create({
            data: {
                ...data,
                fecha: new Date(data.fecha),
            },
        });
    }

    // ✅ Solo turnos futuros
    findAll() {
        return this.prisma.turno.findMany({
            where: {
                fecha: {
                    gte: new Date(), // >= hoy
                },
            },
            orderBy: { fecha: 'asc' },
            include: { paciente: true, odontologo: true },
        });
    }

    findOne(id: number) {
        return this.prisma.turno.findUnique({
            where: { id },
            include: { paciente: true, odontologo: true },
        });
    }

    // ✅ Buscar por fecha (ej: "2025-09-12")
    async findByDate(date: string, odontologoId?: number) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        return this.prisma.turno.findMany({
            where: {
                fecha: {
                    gte: start,
                    lte: end,
                },
                ...(odontologoId && { odontologoId }), // 👈 filtro opcional
            },
            orderBy: { fecha: 'asc' },
            include: { paciente: true, odontologo: true },
        });
    }


    update(id: number, data: UpdateTurnoDto) {
        return this.prisma.turno.update({
            where: { id },
            data,
        });
    }

    remove(id: number) {
        return this.prisma.turno.delete({ where: { id } });
    }
}
