import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: { email: string; password: string }) {
    const jwt = await this.authService.validateUser(loginData.email, loginData.password);
    if (!jwt) throw new UnauthorizedException('Email or password is incorrect');
    return jwt;
  }
}
