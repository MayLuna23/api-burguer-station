import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';

export class CategoryListResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Categorías obtenidas correctamente' })
  message: string;

  @ApiProperty({ type: [CategoryDto] })
  data: CategoryDto[];
}