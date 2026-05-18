import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClienteRecord, ClienteRepository } from '../../../domain/interfaces/cliente.repository';
import { ClientePersistenceModel } from '../../models/cliente.persistence.model';

@Injectable()
export class SequelizeClienteRepository extends ClienteRepository {
  constructor(
    @InjectModel(ClientePersistenceModel)
    private readonly model: typeof ClientePersistenceModel,
  ) {
    super();
  }

  async save(cliente: ClienteRecord): Promise<void> {
    await this.model.create({ ...cliente });
  }

  async findAll(): Promise<ClienteRecord[]> {
    const rows = await this.model.findAll();
    return rows.map((r) => ({ id: r.id, name: r.name, telefone: r.telefone }));
  }

  async findByTelefone(telefone: string): Promise<ClienteRecord | null> {
    const row = await this.model.findOne({ where: { telefone } });
    if (!row) return null;
    return { id: row.id, name: row.name, telefone: row.telefone };
  }

  async findById(id: string): Promise<ClienteRecord | null> {
    const row = await this.model.findByPk(id);
    if (!row) return null;
    return { id: row.id, name: row.name, telefone: row.telefone };
  }
}
