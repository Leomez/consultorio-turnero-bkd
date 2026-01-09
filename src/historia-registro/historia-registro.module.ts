import { Module } from '@nestjs/common';
import { HistoriaRegistroService } from './historia-registro.service';
import { HistoriaRegistroController } from './historia-registro.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [HistoriaRegistroController],
  providers: [HistoriaRegistroService, PrismaService],
})
export class HistoriaRegistroModule {}
