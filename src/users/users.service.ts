import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async create(data: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await this.prisma.user.create({
        data: {
          nombre: data.nombre,
          email: data.email,
          password: hashedPassword,
          role: data.role ?? Role.SECRETARIA,
        },
        select: {
          id: true,
          nombre: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      return user;
    } catch (e) {
      // Manejar unique constraint para email
      if ((e as Prisma.PrismaClientKnownRequestError)?.code === 'P2002') {
        throw new BadRequestException('Email ya registrado');
      }
      throw e;
    }
  }

  async update(id: number, data: UpdateUserDto) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          nombre: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
      return user;
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError)?.code === 'P2002') {
        throw new BadRequestException('Email ya registrado');
      }
      throw error;
    }
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
