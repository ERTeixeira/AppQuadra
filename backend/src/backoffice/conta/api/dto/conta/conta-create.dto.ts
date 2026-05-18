import { ApiProperty } from '@nestjs/swagger';
import { EmailRequired, StringRequired } from '@quadra/shared';

export class ContaCreateDto {
  @ApiProperty({ description: 'Nome completo', minLength: 3, maxLength: 100, example: 'João Silva' })
  @StringRequired('conta.nome', 3, 100)
  name!: string;

  @ApiProperty({ description: 'E-mail', format: 'email', example: 'joao@empresa.com' })
  @EmailRequired('conta.email')
  email!: string;

  @ApiProperty({ description: 'Senha', minLength: 8, example: 'Senha@123' })
  @StringRequired('conta.senha', 8, 100)
  senha!: string;

  @ApiProperty({ description: 'CNPJ da empresa', example: '12.345.678/0001-90' })
  @StringRequired('conta.cnpj', 14, 18)
  cnpj!: string;
}
