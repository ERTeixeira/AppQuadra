import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ContaRecord, ContaRepository } from '../../../domain/interfaces/conta.repository';
import { ContaPersistenceModel } from '../../models/conta.persistence.model';

@Injectable()
export class SequelizeContaRepository extends ContaRepository {
  constructor(
    @InjectModel(ContaPersistenceModel)
    private readonly model: typeof ContaPersistenceModel,
  ) {
    super();
  }

  async save(conta: ContaRecord): Promise<void> {
    await this.model.create({ ...conta });
  }

  async findAll(): Promise<ContaRecord[]> {
    const rows = await this.model.findAll();
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      senhaHash: r.senhaHash,
      cnpj: r.cnpj,
    }));
  }

  async findByEmail(email: string): Promise<ContaRecord | null> {
    const row = await this.model.findOne({ where: { email } });
    if (!row) return null;
    return { id: row.id, name: row.name, email: row.email, senhaHash: row.senhaHash, cnpj: row.cnpj };
  }

  async findByCnpj(cnpj: string): Promise<ContaRecord | null> {
    const row = await this.model.findOne({ where: { cnpj } });
    if (!row) return null;
    return { id: row.id, name: row.name, email: row.email, senhaHash: row.senhaHash, cnpj: row.cnpj };
  }

  async findById(id: string): Promise<ContaRecord | null> {
    const row = await this.model.findByPk(id);
    if (!row) return null;
    return { id: row.id, name: row.name, email: row.email, senhaHash: row.senhaHash, cnpj: row.cnpj };
  }
}
