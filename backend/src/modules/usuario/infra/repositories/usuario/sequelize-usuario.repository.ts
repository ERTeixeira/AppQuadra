import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsuarioRecord, UsuarioRepository } from '../../../domain/interfaces/usuario.repository';
import { UsuarioModel } from '../../models/usuario/usuario.model';

@Injectable()
export class SequelizeUsuarioRepository extends UsuarioRepository {
  constructor(
    @InjectModel(UsuarioModel)
    private readonly usuarioModel: typeof UsuarioModel,
  ) {
    super();
  }

  async save(usuario: UsuarioRecord): Promise<void> {
    await this.usuarioModel.create({ ...usuario });
  }

  async findAll(): Promise<UsuarioRecord[]> {
    const rows = await this.usuarioModel.findAll();
    return rows.map((row) => ({
      name: row.name,
      email: row.email,
      role: row.role,
    }));
  }
}
