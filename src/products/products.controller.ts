import {
  Controller,
  Get,
  Param,
  UseGuards,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  successResponse,
  errorResponse,
} from '@/common/helpers/response.helper';
import { ApiResponseDto } from '@/types/api-response.dto';
import { ProductResponseDto } from './dto/product-list-response.dto';
import { ProductListResponseDto } from './dto/product-response.dto';

@ApiTags('Productos')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Obtiene todos los productos
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida exitosamente',
    type: ProductListResponseDto,
  })
async findAll() {
  const products = await this.productsService.findAll();
  return successResponse(products, 'Productos obtenidos correctamente');
}

  // Obtiene un producto por ID
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', type: Number, description: 'ID del producto' })
  @ApiResponse({
    status: 200,
    description: 'Producto obtenido exitosamente',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
    type: ApiResponseDto,
  })
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(+id);
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return successResponse(product, 'Producto obtenido correctamente');
  }
}
