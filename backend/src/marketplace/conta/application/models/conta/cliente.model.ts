import { DocumentData, IDocumentData, Result, StringRequired } from '@quadra/shared';
import { Exclude, Expose } from 'class-transformer';
import { validate } from 'class-validator';
import { IClienteModel } from '../../interfaces/conta/cliente.model.interface';

@Exclude()
export class ClienteModel extends DocumentData implements IClienteModel {
  constructor(data: IDocumentData) {
    super(data);
  }

  @Expose()
  @StringRequired('cliente.nome', 3, 100)
  name!: string;

  @Expose()
  @StringRequired('cliente.telefone', 10, 20)
  telefone!: string;

  static async create(data: IDocumentData): Promise<Result<ClienteModel>> {
    const inst = new ClienteModel(data);
    const errors = await validate(inst);
    if (errors.length > 0) {
      return Result.fail(errors);
    }
    return Result.ok(inst);
  }

  verificarTelefoneExistente(clientes: { telefone: string }[]): Result<void> {
    if (clientes.some((c) => c.telefone === this.telefone)) {
      return Result.fail('Telefone já cadastrado');
    }
    return Result.ok();
  }
}
