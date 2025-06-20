import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
dotenv.config();

// Definicion de la estrategia JWT para autenticar usuarios en NestJS
// Esta estrategia se encarga de extraer el token JWT del encabezado de autorización y validar
// su firma y contenido. Si el token es válido, se extraen los datos del usuario del payload
// y se retornan para su uso en el sistema de autenticación de NestJS.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // Método que valida el payload del token JWT en cada peticion donde se exige el jwt.
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  }
}
