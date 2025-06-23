import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {}

  async findAll() {
    const method = 'findAll';
    this.logger.log(`[CategoriesService][${method}] Retrieving all categories`);

    try {
      const categories = await this.prisma.category.findMany({
        include: {
          products: true,
        },
      });

      this.logger.log(
        `[CategoriesService][${method}] Found ${categories.length} categories`,
      );

      return categories;
    } catch (error) {
      this.logger.error(
        `[CategoriesService][${method}] Error retrieving categories: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error retrieving categories');
    }
  }

  async findOne(id: number) {
    const method = 'findOne';
    this.logger.log(
      `[CategoriesService][${method}] Searching for category with id ${id}`,
    );

    try {
      const category = await this.prisma.category.findUnique({
        where: { category_id: id },
        include: {
          products: true,
        },
      });

      if (!category) {
        this.logger.warn(
          `[CategoriesService][${method}] No category found with id ${id}`,
        );
        return category;
      }

      this.logger.log(
        `[CategoriesService][${method}] Found category with id ${id}`,
      );
      return category;
    } catch (error) {
      this.logger.error(
        `[CategoriesService][${method}] Error retrieving category: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error retrieving category');
    }
  }
}
