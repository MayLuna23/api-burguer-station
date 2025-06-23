import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './product.dto';

export class ProductResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Producto obtenido correctamente' })
  message: string;

  @ApiProperty({ type: [ProductDto] })
  data: ProductDto;
}