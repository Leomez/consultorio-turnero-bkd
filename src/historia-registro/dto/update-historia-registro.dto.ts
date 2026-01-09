import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoriaRegistroDto } from './create-historia-registro.dto';

export class UpdateHistoriaRegistroDto extends PartialType(CreateHistoriaRegistroDto) {}
