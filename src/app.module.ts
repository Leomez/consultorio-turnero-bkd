import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { AuthModule } from './auth/auth.module';
import { TurnosModule } from './turnos/turnos.module';

@Module({
  imports: [PrismaModule, UsersModule, PacientesModule, AuthModule, TurnosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
