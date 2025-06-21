import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

type ProductsSold = {
  name: string;
  price: number;
  quantity: number;
};


@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('send')
  async sendEmail(
    @Body() data: { email: string; total: number; products: ProductsSold[] },
  ) {
    const response = await this.emailService.sendEmail(data);
    return {
      statusCode: response.statusCode,
      message: response.message,
      data: response.data,
    };
  }
}
