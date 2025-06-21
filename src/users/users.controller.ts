import { Controller, Post, Body, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Ruta para crear un nuevo usuario
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() newUserData: CreateUserDto) {
    const response = await this.usersService.create(newUserData);
    if (response.statusCode === 409) {
      throw new HttpException(
        {
          statusCode: response.statusCode,
          message: response.message,
          data: null,
        },
        HttpStatus.CONFLICT,
      );
    }

    return {
      statusCode: response.statusCode,
      message: response.message,
      data: response.data,
    }
    
  }
}
