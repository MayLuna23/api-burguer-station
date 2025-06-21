import { IsArray, IsEmail, IsNotEmpty, IsNumber, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ExtrasDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}

class ProductsSoldDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  totalPrice: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExtrasDto)
  extras: ExtrasDto[];
}

// Este es el DTO que necesitas usar en el Controller
export class EmailSendDto {
  @IsNumber()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductsSoldDto)
  products: ProductsSoldDto[];
}
