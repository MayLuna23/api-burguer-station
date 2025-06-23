import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { EmailSendDto } from './dto/email-send.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseDto } from '@/types/api-response.dto';
import { successResponse } from '@/common/helpers/response.helper';

@ApiTags('Email')
@ApiBearerAuth()
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar confirmación de compra por correo electrónico',
    description:
      'Este endpoint envía un correo al cliente con el resumen detallado de su compra.',
  })
  @ApiBody({
    type: EmailSendDto,
    examples: {
      example1: {
        summary: 'Compra válida',
        value: {
          total: 13.5,
          products: [
            {
              name: 'La Montañesa',
              price: 6.0,
              quantity: 2,
              totalPrice: 12.0,
              extras: [
                { name: 'Queso cheddar', price: 0.5 },
                { name: 'Huevo frito', price: 1.0 },
              ],
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Correo enviado correctamente',
    schema: {
      example: {
        statusCode: 200,
        message: 'Correo enviado correctamente',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno al enviar el correo',
    schema: {
      example: {
        statusCode: 500,
        message: 'No se pudo enviar el correo',
        errors: 'Información detallada del error',
      },
    },
  })
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

    return successResponse(
      response.data,
      response.message,
      response.statusCode,
    );
  }
}
