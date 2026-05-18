import { ApiProperty } from '@nestjs/swagger';
import { StringRequired } from '@quadra/shared';

export class VerificarOtpDto {
  @ApiProperty({ example: '+5511999999999' })
  @StringRequired('verificarOtp.telefone', 10, 15)
  telefone!: string;

  @ApiProperty({ example: '123456' })
  @StringRequired('verificarOtp.codigo', 6, 6)
  codigo!: string;
}
