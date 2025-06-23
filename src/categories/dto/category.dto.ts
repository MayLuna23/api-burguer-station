import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from '@/products/dto/product.dto';

export class CategoryDto {
  @ApiProperty()
  category_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [ProductDto] }) // Se usa ProductDto por que categoriy trae anidados los products
  products: ProductDto[];
}