import { ApiProperty } from '@nestjs/swagger';
import { StringRequired } from '@quadra/shared';

export class LoginBackofficeDto {
  @ApiProperty({ example: 'joao@empresa.com' })
  @StringRequired('login.email', 5, 100)
  email!: string;

  @ApiProperty({ example: 'Senha@123' })
  @StringRequired('login.senha', 8, 100)
  senha!: string;

  @ApiProperty({ example: '12.345.678/0001-90' })
  @StringRequired('login.cnpj', 14, 18)
  cnpj!: string;
}
