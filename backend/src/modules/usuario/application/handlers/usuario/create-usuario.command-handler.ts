import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsuarioRepository } from '../../../domain/interfaces/usuario.repository';
import { CreateUsuarioCommand } from '../../commands/usuario/create-usuario.command';
import { UsuarioModel } from '../../models/usuario/usuario.model';

@CommandHandler(CreateUsuarioCommand)
export class CreateUsuarioHandler implements ICommandHandler<CreateUsuarioCommand> {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly repository: UsuarioRepository,
  ) {}

  async execute(command: CreateUsuarioCommand): Promise<void> {
    const todos = await this.repository.findAll();
    const alreadyExists = todos.some((u) => u.email === command.usuarioCreateDto.email);

    const result = await UsuarioModel.create(
      command.usuarioCreateDto,
      alreadyExists,
    );

    if (result.isFailure) {
      throw new BadRequestException(result.getError());
    }

    const model = result.getValue();
    await this.repository.save({
      name: model.name,
      email: model.email,
      role: model.role,
    });
  }
}
