import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Cache } from 'cache-manager';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {}

  async findAll() {
    const method = 'findAll';
    this.logger.log(`[ProductsService][${method}] Retrieving all products`);

    try {
      const products = await this.prisma.product.findMany();

      this.logger.log(
        `[ProductsService][${method}] Found ${products.length} products`,
      );

      return products;
    } catch (error) {
      this.logger.error(
        `[ProductsService][${method}] Error retrieving products: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error retrieving products');
    }
  }

  async findOne(id: number) {
    console.log(id);
    const method = 'findOne';
    this.logger.log(
      `[ProductsService][${method}] Searching for product with id ${id}`,
    );

    try {
      const product = await this.prisma.product.findUnique({
        where: { product_id: id },
      });

      if (!product) {
        this.logger.warn(
          `[ProductsService][${method}] No product found with id ${id}`,
        );
        return product
        // throw new NotFoundException(`Product with id ${id} not found`);
      }

      this.logger.log(
        `[ProductsService][${method}] Found product with id ${id}`,
      );
      return product;
    } catch (error) {
      this.logger.error(
        `[ProductsService][${method}] Error retrieving product: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error retrieving product');
    }
  }
}
