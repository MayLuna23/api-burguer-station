import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';

export class CategoryResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Categoría obtenidas correctamente' })
  message: string;

  @ApiProperty({ type: [CategoryDto] })
  data: CategoryDto;
}