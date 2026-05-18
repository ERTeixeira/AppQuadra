import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { ClienteRepository } from '../../../domain/interfaces/cliente.repository';
import { CreateClienteCommand } from '../../commands/conta/create-cliente.command';
import { ClienteModel } from '../../models/conta/cliente.model';

@CommandHandler(CreateClienteCommand)
export class CreateClienteHandler implements ICommandHandler<CreateClienteCommand> {
  constructor(
    @Inject('IClienteRepository')
    private readonly repository: ClienteRepository,
  ) {}

  async execute(command: CreateClienteCommand): Promise<void> {
    const modelResult = await ClienteModel.create(command.dto);

    if (modelResult.isFailure) {
      throw new BadRequestException(modelResult.error);
    }

    const clientes = await this.repository.findAll();
    const model = modelResult.getValue();

    const telefoneResult = model.verificarTelefoneExistente(clientes);
    if (telefoneResult.isFailure) {
      throw new BadRequestException(telefoneResult.error);
    }

    await this.repository.save({
      id: uuidv4(),
      name: model.name,
      telefone: model.telefone,
    });
  }
}
