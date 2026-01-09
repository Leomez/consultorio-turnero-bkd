import { Controller, Post, Get, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { HistoriaRegistroService } from './historia-registro.service';
import { CreateHistoriaRegistroDto } from './dto/create-historia-registro.dto';
import { UpdateHistoriaRegistroDto } from './dto/update-historia-registro.dto';

@Controller('historias-registros')
export class HistoriaRegistroController {
  constructor(private readonly service: HistoriaRegistroService) {}

  @Post()
  create(@Body() dto: CreateHistoriaRegistroDto) {
    return this.service.create(dto);
  }

  @Get('historia/:historiaId')
  findByHistoria(@Param('historiaId', ParseIntPipe) historiaId: number) {
    return this.service.findByHistoria(historiaId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHistoriaRegistroDto) {
    return this.service.update(id, dto);
  }
}
