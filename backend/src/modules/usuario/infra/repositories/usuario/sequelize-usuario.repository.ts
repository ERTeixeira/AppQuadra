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
    await this.usuarioModel.create({
      name: usuario.name,
      email: usuario.email,
      role: usuario.role,
    });
  }

  async findAll(): Promise<UsuarioRecord[]> {
    const rows = await this.usuarioModel.findAll();
    return rows.map((row) => ({
      name: row.name,
      email: row.email,
      role: row.role,
    }));
  }

  async findByEmail(email: string): Promise<UsuarioRecord | null> {
    const row = await this.usuarioModel.findOne({ where: { email } });
    if (!row) return null;
    return {
      name: row.name,
      email: row.email,
      role: row.role,
    };
  }
}
