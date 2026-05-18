import { ICommand } from '@nestjs/cqrs';
import { ClienteCreateDto } from '../../../api/dto/conta/cliente-create.dto';

export class CreateClienteCommand implements ICommand {
  constructor(public readonly dto: ClienteCreateDto) {}
}
