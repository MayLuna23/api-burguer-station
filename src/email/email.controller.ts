import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { EmailService } from './email.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { EmailSendDto } from './dto/email-send.dto';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('send')
  @UseGuards(AuthGuard('jwt'))
  async sendEmail(
    @Req()
    req: Request & { user: { userId: number; email: string; name: string } },
    @Body() data: EmailSendDto,
  ) {
    const dataWithEmail = {
      ...data,
      email: req.user.email,
    };

    const response = await this.emailService.sendEmail(dataWithEmail);
    return {
      statusCode: response.statusCode,
      message: response.message,
      data: response.data,
    };
  }
}
