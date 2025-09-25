import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

@Injectable()
export class TurnosService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateTurnoDto) {
        // 🔹 Validar que el odontólogo no tenga otro turno en la misma fecha/hora
        const existingTurno = await this.prisma.turno.findFirst({
            where: {
                odontologoId: data.odontologoId,
                fecha: data.fecha,
            },
        });

        if (existingTurno) {
            throw new BadRequestException(
                'El odontólogo ya tiene un turno en esta fecha y hora',
            );
        }

        return this.prisma.turno.create({
            data: data,
            include: { paciente: true, odontologo: true },
        });
    }

    // ✅ Solo turnos futuros
    async findAll() {
        const turno = await this.prisma.turno.findMany({
            where: {
                fecha: {
                    gte: new Date(), // >= hoy
                },
            },
            orderBy: { fecha: 'asc' },
            include: { paciente: true, odontologo: true },
        });

        return turno;
    }

    async findOne(id: number) {
        const turno = await this.prisma.turno.findUnique({
            where: { id },
            include: { paciente: true, odontologo: true },
        });

        if (!turno) throw new NotFoundException('Turno no encontrado');
        return turno;
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


    async update(id: number, data: UpdateTurnoDto) {
        // 🔹 Validar que el odontólogo no se solape si cambia fecha/hora
        if (data.fecha && data.odontologoId) {
            const conflict = await this.prisma.turno.findFirst({
                where: {
                    odontologoId: data.odontologoId,
                    fecha: data.fecha,
                    NOT: { id },
                },
            });
            if (conflict) {
                throw new BadRequestException(
                    'El odontólogo ya tiene un turno en esta fecha y hora',
                );
            }
        }

        return this.prisma.turno.update({
            where: { id },
            data: {
                ...data,
                fecha: data.fecha ? new Date(data.fecha) : undefined,
            },
            include: { paciente: true, odontologo: true },
        });
    }

    remove(id: number) {
        return this.prisma.turno.delete({ where: { id } });
    }
}
