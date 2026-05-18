import { Model } from 'sequelize-typescript';
import { BaseRepository } from './base.repository';

export abstract class SequelizeBaseRepository<
  TRecord extends { id: string },
  TModel extends Model,
> extends BaseRepository<TRecord> {
  constructor(protected readonly model: any) {
    super();
  }

  protected abstract toRecord(row: TModel): TRecord;

  async save(record: TRecord): Promise<void> {
    await this.model.create({ ...record });
  }

  async findAll(where?: Partial<TRecord>): Promise<TRecord[]> {
    const rows: TModel[] = await this.model.findAll(where ? { where } : {});
    return rows.map((r) => this.toRecord(r));
  }

  async findById(id: string): Promise<TRecord | null> {
    const row: TModel | null = await this.model.findByPk(id);
    if (!row) return null;
    return this.toRecord(row);
  }

  async delete(id: string): Promise<void> {
    await this.model.destroy({ where: { id } });
  }
}
