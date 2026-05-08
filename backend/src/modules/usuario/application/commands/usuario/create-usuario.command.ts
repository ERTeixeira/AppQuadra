import { ICommand } from '@nestjs/cqrs';
import { UsuarioCreateDto } from '../../../api/dto/usuario/usuario-create.dto';

export class CreateUsuarioCommand implements ICommand {
  constructor(public usuarioCreateDto: UsuarioCreateDto
  ) {}
}
