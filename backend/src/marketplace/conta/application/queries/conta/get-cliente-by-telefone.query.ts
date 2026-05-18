import { IQuery } from '@nestjs/cqrs';

export class GetClienteByTelefoneQuery implements IQuery {
  constructor(public readonly telefone: string) {}
}
