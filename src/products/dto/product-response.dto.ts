import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './product.dto';

export class ProductListResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Productos obtenidos correctamente' })
  message: string;

  @ApiProperty({ type: [ProductDto] })
  data: ProductDto[];
}