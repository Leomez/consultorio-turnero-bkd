import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service'; 
import { PacientesModule } from './pacientes/pacientes.module';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Backend funcionando!';
  }
}
