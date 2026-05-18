import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'backoffice_contas', timestamps: true })
export class ContaPersistenceModel extends Model {
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare senhaHash: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare cnpj: string;
}
