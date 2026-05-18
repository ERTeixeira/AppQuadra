import { ApiProperty } from '@nestjs/swagger';
import { StringRequired } from '@quadra/shared';

export class SolicitarOtpDto {
  @ApiProperty({ example: '+5511999999999' })
  @StringRequired('solicitarOtp.telefone', 10, 15)
  telefone!: string;
}
