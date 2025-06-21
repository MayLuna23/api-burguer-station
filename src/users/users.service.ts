import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import { getFormattedDateTime } from 'src/common/utils/date-time.util';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache, // Inyectar el servicio de caché
  ) {}

  async create(newUserData: CreateUserDto) {
    const method = 'create';
    this.logger.log(
      `[UsersService][${method}] Creating new user: ${JSON.stringify({ ...newUserData, password: '***' })}`,
    );

    try {
      const hashedPassword = await bcrypt.hash(newUserData.password, 10);

      const user = await this.prisma.user.create({
        data: {
          ...newUserData,
          password: hashedPassword,
          register: getFormattedDateTime(),
        },
      });

      this.logger.log(
        `[UsersService][${method}] User created with id ${user.id}`,
      );

      // Excluir password al retornar
      const { password, ...result } = user;
      return result;
    } catch (error) {
      this.logger.error(
        `[UsersService][${method}] Error creating user: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findByEmail(email: string) {
    const method = 'findByEmail';
    this.logger.log(
      `[UsersService][${method}] Searching for user with email ${email}`,
    );

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        this.logger.warn(
          `[UsersService][${method}] No user found with email ${email}`,
        );
        return null;
      }

      this.logger.log(
        `[UsersService][${method}] User with email ${email} found`,
      );
      return user;
    } catch (error) {
      this.logger.error(
        `[UsersService][${method}] Error searching for user with email ${email}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error finding user by email');
    }
  }

}
