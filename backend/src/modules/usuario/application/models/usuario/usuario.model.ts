import { Exclude, Expose } from 'class-transformer';
import { validate } from 'class-validator';

import {
    EmailRequired,
    IDocumentData,
    Result,
    StringRequired,
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
  @StringRequired('usuario.nome', 3, 100)
  name!: string;

  @Expose()
  @EmailRequired('usuario.email')
  email!: string;

  @Expose()
  @StringRequired('usuario.role', 1, 50)
  role!: string;

  static async create(
    data: IDocumentData,
    alreadyExists: boolean,
  ): Promise<Result<UsuarioModel>> {
    if (alreadyExists) {
      return Result.fail('usuario.email_ja_cadastrado');
    }

    const inst = new UsuarioModel(data);

    const errors = await validate(inst);
    if (errors.length > 0) {
      return Result.fail(errors);
    }
    return Result.ok(inst);
  }
}