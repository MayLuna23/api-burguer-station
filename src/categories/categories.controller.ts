import { Controller, Get, Param, UseGuards, HttpStatus, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  successResponse,
  errorResponse,
} from '@/common/helpers/response.helper';
import { ApiResponseDto } from '@/types/api-response.dto';
import { CategoryListResponseDto } from './dto/category-list-response.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

@ApiTags('Categorías')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Obtener categorias
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'Categorías obtenidas correctamente',
    type: CategoryListResponseDto,
  })
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return successResponse(categories, 'Categorías obtenidas correctamente');
  }

  // Obtener una categoria por ID
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', type: Number, description: 'ID de la categoría' })
  @ApiResponse({
    status: 200,
    description: 'Categoría obtenida correctamente',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
    type: ApiResponseDto,
  })
  async findOne(@Param('id') id: string) {
    const category = await this.categoriesService.findOne(+id);

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return successResponse(category, 'Categoría obtenida correctamente');
  }
}
