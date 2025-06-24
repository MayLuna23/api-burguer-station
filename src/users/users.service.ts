import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@/prisma.service';
import { getFormattedDateTime } from '@/common/utils/date-time.util';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

async create(newUserData: CreateUserDto) {
  const method = 'create';
  this.logger.log(
    `[UsersService][${method}] Creating new user: ${JSON.stringify({
      ...newUserData,
      password: '***',
    })}`,
  );

  try {
    const existingUser = await this.checkIfUserExists(newUserData.email);
    if (existingUser) {
      this.logger.warn(
        `[UsersService][${method}] User with email ${newUserData.email} already exists`,
      );
      return null;
    }

    const hashedPassword = await this.hashPassword(newUserData.password);

    const user = await this.prisma.user.create({
      data: {
        ...newUserData,
        password: hashedPassword,
        register: getFormattedDateTime(),
      },
    });

    this.logger.log(`[UsersService][${method}] User created with id ${user.id}`);

    const { password, ...result } = user;
    return {
      statusCode: 201,
      message: 'Usuario creado exitosamente',
      data: result,
    };
  } catch (error) {
    this.logger.error(
      `[UsersService][${method}] Error creating user: ${error.message}`,
      error.stack,
    );
    throw new InternalServerErrorException('Error creating user');
  }
}

private async hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

private async checkIfUserExists(email: string): Promise<boolean> {
  const user = await this.findByEmail(email);
  return !!user;
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
