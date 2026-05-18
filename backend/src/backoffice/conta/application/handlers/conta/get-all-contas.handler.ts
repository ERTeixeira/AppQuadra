import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ContaRecord, ContaRepository } from '../../../domain/interfaces/conta.repository';
import { GetAllContasQuery } from '../../queries/conta/get-all-contas.query';

@QueryHandler(GetAllContasQuery)
export class GetAllContasHandler implements IQueryHandler<GetAllContasQuery, Omit<ContaRecord, 'senhaHash'>[]> {
  constructor(
    @Inject('IContaRepository')
    private readonly repository: ContaRepository,
  ) {}

  async execute(): Promise<Omit<ContaRecord, 'senhaHash'>[]> {
    const contas = await this.repository.findAll();
    return contas.map(({ senhaHash: _, ...rest }) => rest);
  }
}
