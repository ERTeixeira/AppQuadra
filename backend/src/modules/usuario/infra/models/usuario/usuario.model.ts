import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'usuarios', timestamps: true })
export class UsuarioModel extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare role: string;
}
