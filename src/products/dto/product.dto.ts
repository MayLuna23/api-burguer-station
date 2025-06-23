import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty()
  product_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ nullable: true, type: String })
  description: string | null;

  @ApiProperty()
  categoryId: number;
}