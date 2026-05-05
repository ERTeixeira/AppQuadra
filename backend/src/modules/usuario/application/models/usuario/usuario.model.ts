import { Exclude, Expose } from 'class-transformer';
import { validate } from 'class-validator';

import {
  EmailRequired,
  IDocumentData,
  PhoneOptional,
  Result,
  StringOptional,
  StringRequired,
  UuidRequired
} from '@quadra/shared';

import { DocumentData } from '@quadra/shared';

import { IUsuarioModel } from '../../interfaces/usuario/usuario.model.interface';


@Exclude()
export class UsuarioModel
  extends DocumentData
  implements IUsuarioModel
{
  constructor(data: IDocumentData) {
    super(data);
  }

  @Expose()
  @UuidRequired('usuario.empresa_id')
  empresaId!: string;

  @Expose()
  @StringRequired('usuario.nome', 3, 100)
  name!: string;

  @Expose()
  @EmailRequired('usuario.email')
  email!: string;

  @Expose()
  @StringRequired('usuario.role', 1, 50)
  role!: string;

  @Expose()
  @PhoneOptional('usuario.telefone', 11, 11)
  telefone?: string;

  @Expose()
  @StringOptional('usuario.observacoes', 0, 500)
  observacoes?: string;

  static async create(data: IDocumentData): Promise<Result<UsuarioModel>> {
    const inst = new UsuarioModel(data);
    
    const errors = await validate(inst);
    if (errors.length > 0) {
      return Result.fail(errors);
    }
    return Result.ok(inst);
  }
}