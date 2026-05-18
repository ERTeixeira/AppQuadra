import { ICommand } from '@nestjs/cqrs';
import { ContaCreateDto } from '../../../api/dto/conta/conta-create.dto';

export class CreateContaCommand implements ICommand {
  constructor(public readonly dto: ContaCreateDto) {}
}
