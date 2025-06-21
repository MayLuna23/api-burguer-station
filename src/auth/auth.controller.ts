import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  HttpCode,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginData: LoginUserDto) {
    const data = await this.authService.validateUser(
      loginData.email,
      loginData.password,
    );

    if (!data.jwtToken) {
      throw new HttpException(
        {
          statusCode: 401,
          message: 'Correo electrónico o contraseña incorrectos',
          data: {
            userName: null,
            jwt: null,
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      statusCode: 200,
      message: 'Login exitoso',
      data: {
        userName: data.userName,
        jwt: data.jwtToken,
      },
    };
  }

}
  
