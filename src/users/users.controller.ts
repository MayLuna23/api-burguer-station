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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '@/types/api-response.dto';
import {
  successResponse,
  errorResponse,
} from '../common/helpers/response.helper';

@Controller('users')
@ApiTags('Usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: ApiResponseDto,
  })
  async create(@Body() newUserData: CreateUserDto) {
    const response = await this.usersService.create(newUserData);

    if (!response) {
      throw new ConflictException('El correo ya está registrado');
    }

    return successResponse(response.data, 'Usuario creado correctamente', 201);
  }
}
