import { ApiProperty } from '@nestjs/swagger';

export class LoginSuccessDataDto {
  @ApiProperty({ example: 'Mayra Luna', nullable: true })
  userName: string | null;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    nullable: true,
  })
  jwt: string | null;
}
