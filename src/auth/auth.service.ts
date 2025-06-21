import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

// El servicio de autenticación se encarga de validar las credenciales del usuario
// y generar un token JWT si las credenciales son correctas.
// Este servicio utiliza el UsersService para buscar al usuario por su correo electrónico
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<{ userName: string | null; jwtToken: string | null }> {
    const method = 'validateUser';
    this.logger.log(
      `[AuthService][${method}] Validating user credentials for email: ${email}`,
    );
    const user = await this.usersService.findByEmail(email);
    // Si no se encuentra el usuario, lanzamos una excepción de autorización
    if (!user) {
      return {
        userName: null,
        jwtToken: null,
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    // Si la contraseña no coincide, lanzamos una excepción de autorización
    if (!isMatch) {
      return {
        userName: null,
        jwtToken: null,
      };
    }
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      registerDate: user.register,
    };

    return {
      userName: user.name,
      jwtToken: await this.jwtService.signAsync(payload),
    };
  }
}
