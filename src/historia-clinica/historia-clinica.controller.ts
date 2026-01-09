import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { HistoriaClinicaService } from './historia-clinica.service';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';

@Controller('historias-clinicas')
export class HistoriaClinicaController {
  constructor(private readonly service: HistoriaClinicaService) {}

  @Post()
  create(@Body() dto: CreateHistoriaClinicaDto) {
    return this.service.create(dto);
  }

  @Get(':pacienteId')
  findByPaciente(@Param('pacienteId', ParseIntPipe) pacienteId: number) {
    return this.service.findByPaciente(pacienteId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
