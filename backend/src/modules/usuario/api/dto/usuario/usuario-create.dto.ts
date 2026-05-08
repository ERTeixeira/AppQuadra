import { ApiProperty } from '@nestjs/swagger';
import {
  EmailRequired,
  StringRequired,
} from '@quadra/shared';

/**
 * DTO para criação de usuário
 * Utilizando validation decorators sem prefixo "Sis"
 */
export class UsuarioCreateDto {
  @ApiProperty({ description: 'Nome do usuário', minLength: 3, maxLength: 100, example: 'João Silva' })
  @StringRequired('usuario.nome', 3, 100)
  name!: string;

  @ApiProperty({ description: 'E-mail do usuário', format: 'email', example: 'joao@email.com' })
  @EmailRequired('usuario.email')
  email!: string;

  @ApiProperty({ description: 'Papel do usuário no sistema', minLength: 1, maxLength: 50, example: 'admin' })
  @StringRequired('usuario.role', 1, 50)
  role!: string;
}
