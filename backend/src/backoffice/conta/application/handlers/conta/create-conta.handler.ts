import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ContaRepository } from '../../../domain/interfaces/conta.repository';
import { CreateContaCommand } from '../../commands/conta/create-conta.command';
import { ContaModel } from '../../models/conta/conta.model';

@CommandHandler(CreateContaCommand)
export class CreateContaHandler implements ICommandHandler<CreateContaCommand> {
  constructor(
    @Inject('IContaRepository')
    private readonly repository: ContaRepository,
  ) {}

  async execute(command: CreateContaCommand): Promise<void> {
    const contaModelResult = await ContaModel.create(command.dto);

    if (contaModelResult.isFailure) {
      throw new BadRequestException(contaModelResult.error);
    }

    const contas = await this.repository.findAll();
    const model = contaModelResult.getValue();

    const emailResult = model.verificarEmailExistente(contas);
    if (emailResult.isFailure) {
      throw new BadRequestException(emailResult.error);
    }

    const cnpjResult = model.verificarCnpjExistente(contas);
    if (cnpjResult.isFailure) {
      throw new BadRequestException(cnpjResult.error);
    }

    const senhaHash = await bcrypt.hash(command.dto.senha, 10);

    await this.repository.save({
      id: uuidv4(),
      name: model.name,
      email: model.email,
      senhaHash,
      cnpj: model.cnpj,
    });
  }
}
