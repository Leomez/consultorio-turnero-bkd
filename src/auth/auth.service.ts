import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(data: RegisterDto) {
    try {
      const existingUser = await this.userService.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }

      // userService.create() retorna el usuario SIN password (lo excluye en el select)
      const user = await this.userService.create({
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        role: data.role ?? Role.SECRETARIA,
      });

      return {
        message: 'Usuario registrado exitosamente',
        user: user,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al registrar usuario');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Excluir password del retorno
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshPayload = {
      sub: user.id,
      type: 'refresh',
    };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d',
      secret: this.configService.get('JWT_REFRESH_SECRET') || 'refresh-secret',
    });

    // user ya es del tipo Omit<User, 'password'>, así que no tiene password
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: user,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET') || 'refresh-secret',
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token inválido');
      }

      // Usar findOne en lugar de findById (que no existe)
      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        type: 'access',
      };
      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
      });

      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException('Token de refresco inválido o expirado');
    }
  }
}
