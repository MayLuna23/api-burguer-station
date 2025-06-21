import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { EmailController } from './email/email.controller';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';

@Module({
  imports: [CacheModule.register(), UsersModule, AuthModule, ProductsModule, CategoriesModule, EmailModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class AppModule {}
