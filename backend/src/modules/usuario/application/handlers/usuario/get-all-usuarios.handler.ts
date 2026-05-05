import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsuarioRecord, UsuarioRepository } from '../../../domain/interfaces/usuario.repository';
import { GetAllUsuariosQuery } from '../../queries/usuario/get-all-usuarios.query';

@QueryHandler(GetAllUsuariosQuery)
export class GetAllUsuariosHandler implements IQueryHandler<GetAllUsuariosQuery, UsuarioRecord[]> {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly repository: UsuarioRepository,
  ) {}

  execute(): Promise<UsuarioRecord[]> {
    return this.repository.findAll();
  }
}
