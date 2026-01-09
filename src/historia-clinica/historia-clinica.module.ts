import { Module } from '@nestjs/common';
import { HistoriaClinicaService } from './historia-clinica.service';
import { HistoriaClinicaController } from './historia-clinica.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [HistoriaClinicaController],
  providers: [HistoriaClinicaService, PrismaService],
  exports: [HistoriaClinicaService],
})
export class HistoriaClinicaModule {}
