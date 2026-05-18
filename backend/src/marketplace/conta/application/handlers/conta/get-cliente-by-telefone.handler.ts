import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ClienteRecord, ClienteRepository } from '../../../domain/interfaces/cliente.repository';
import { GetClienteByTelefoneQuery } from '../../queries/conta/get-cliente-by-telefone.query';

@QueryHandler(GetClienteByTelefoneQuery)
export class GetClienteByTelefoneHandler
  implements IQueryHandler<GetClienteByTelefoneQuery, ClienteRecord | null>
{
  constructor(
    @Inject('IClienteRepository')
    private readonly repository: ClienteRepository,
  ) {}

  execute(query: GetClienteByTelefoneQuery): Promise<ClienteRecord | null> {
    return this.repository.findByTelefone(query.telefone);
  }
}
