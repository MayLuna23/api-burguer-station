import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { successResponse } from '@/common/helpers/response.helper';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiBody({
    type: LoginUserDto,
    schema: {
      example: {
        email: 'admin@burguer.com',
        password: '123456',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales incorrectas',
    schema: {
      example: {
        statusCode: 401,
        message: 'Correo electrónico o contraseña incorrectos',
        data: {
          userName: null,
          jwt: null,
        },
      },
    },
  })
  async login(@Body() loginData: LoginUserDto) {
    const data = await this.authService.validateUser(
      loginData.email,
      loginData.password,
    );

    if (!data.jwtToken) {
      throw new UnauthorizedException(
        successResponse(
          {
            userName: null,
            jwt: null,
          },
          'Correo electrónico o contraseña incorrectos',
          401,
        ),
      );
    }

    return successResponse(
      {
        userName: data.userName,
        jwt: data.jwtToken,
      },
      'Login exitoso',
      200,
    );
  }

  @Get('verify')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verifica si el token JWT es válido' })
  @ApiResponse({ status: 200, description: 'Token válido' })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o no proporcionado',
  })
  verifyToken() {
    return successResponse({data: true}, 'Token verificado exitosamente', 200 )

  }
}
