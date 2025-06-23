import { ApiProperty } from '@nestjs/swagger';

export class EmailSendResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Correo enviado correctamente' })
  message: string;

  @ApiProperty({ example: null, nullable: true })
  data: any;
}
