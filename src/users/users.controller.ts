import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse, ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiResponseDto } from '@/types/api-response.dto';
import { successResponse } from '@/common/helpers/response.helper';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Usuario válido',
        value: {
          name: 'Mayra Luna',
          email: 'mayra@example.com',
          password: '12345678#A',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    schema: {
      example: {
        statusCode: 201,
        message: 'Usuario creado correctamente',
        data: {
          id: 1,
          name: 'Mayra Luna',
          email: 'mayra@example.com',
          register: '21:59 23/06/2025',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'El correo ya está registrado',
    schema: {
      example: {
        statusCode: 409,
        message: 'El correo ya está registrado',
        errors: null,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error al crear el usuario',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error creating user',
        errors: 'Error detallado del servidor',
      },
    },
  })
  async create(@Body() newUserData: CreateUserDto) {
    const response = await this.usersService.create(newUserData);

    if (!response) {
      throw new ConflictException('El correo ya está registrado');
    }

    return successResponse(response.data, 'Usuario creado correctamente', 201);
  }
}
