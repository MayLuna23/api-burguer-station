import { ApiProperty } from '@nestjs/swagger';
import { LoginSuccessDataDto } from './login-success-data.dto';

export class LoginResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Login exitoso' })
  message: string;

  @ApiProperty({ type: LoginSuccessDataDto })
  data: LoginSuccessDataDto;
}
