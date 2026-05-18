import { ApiProperty } from '@nestjs/swagger';
import { StringRequired } from '@quadra/shared';

export class ClienteCreateDto {
  @ApiProperty({ description: 'Nome completo', minLength: 3, maxLength: 100, example: 'Maria Santos' })
  @StringRequired('cliente.nome', 3, 100)
  name!: string;

  @ApiProperty({ description: 'Número de telefone (identificador único)', example: '+5511999999999' })
  @StringRequired('cliente.telefone', 10, 20)
  telefone!: string;
}
