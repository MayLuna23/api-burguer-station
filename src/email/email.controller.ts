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
import { successResponse } from '@/common/helpers/response.helper'; // 👈 asegúrate de tener esto bien importado

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
  })
  @ApiBody({
    type: EmailSendDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Correo enviado correctamente',
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno al enviar el correo',
    type: ApiResponseDto,
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
