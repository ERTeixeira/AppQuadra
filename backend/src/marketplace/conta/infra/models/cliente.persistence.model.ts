import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'marketplace_clientes', timestamps: true })
export class ClientePersistenceModel extends Model {
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare telefone: string;
}
