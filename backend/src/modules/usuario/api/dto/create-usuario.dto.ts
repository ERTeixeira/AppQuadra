import {
  EmailRequired,
  PhoneOptional,
  StringOptional,
  StringRequired,
  UuidRequired,
} from '@quadra/shared';

/**
 * DTO para criação de usuário
 * Utilizando validation decorators sem prefixo "Sis"
 */
export class CreateUsuarioDto {
  @UuidRequired('usuario.empresa_id')
  empresaId!: string;

  @StringRequired('usuario.nome', 3, 100)
  name!: string;

  @EmailRequired('usuario.email')
  email!: string;

  @StringRequired('usuario.role', 1, 50)
  role!: string;

  @PhoneOptional('usuario.telefone', 11, 11)
  telefone?: string;

  @StringOptional('usuario.observacoes', 0, 500)
  observacoes?: string;
}
