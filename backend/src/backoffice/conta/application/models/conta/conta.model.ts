import { DocumentData, EmailRequired, IDocumentData, Result, StringRequired } from '@quadra/shared';
import { Exclude, Expose } from 'class-transformer';
import { validate } from 'class-validator';
import { IContaModel } from '../../interfaces/conta/conta.model.interface';

@Exclude()
export class ContaModel extends DocumentData implements IContaModel {
  constructor(data: IDocumentData) {
    super(data);
  }

  @Expose()
  @StringRequired('conta.nome', 3, 100)
  name!: string;

  @Expose()
  @EmailRequired('conta.email')
  email!: string;

  @Expose()
  @StringRequired('conta.cnpj', 14, 18)
  cnpj!: string;

  static async create(data: IDocumentData): Promise<Result<ContaModel>> {
    const inst = new ContaModel(data);
    const errors = await validate(inst);
    if (errors.length > 0) {
      return Result.fail(errors);
    }
    return Result.ok(inst);
  }

  verificarEmailExistente(contas: { email: string }[]): Result<void> {
    if (contas.some((c) => c.email === this.email)) {
      return Result.fail('E-mail já cadastrado');
    }
    return Result.ok();
  }

  verificarCnpjExistente(contas: { cnpj: string }[]): Result<void> {
    if (contas.some((c) => c.cnpj === this.cnpj)) {
      return Result.fail('CNPJ já cadastrado');
    }
    return Result.ok();
  }
}
