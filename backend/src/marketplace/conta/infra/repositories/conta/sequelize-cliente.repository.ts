import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { SequelizeBaseRepository } from "../../../../../common/repositories/sequelize-base.repository";
import {
  ClienteRecord,
  ClienteRepository,
} from "../../../domain/interfaces/cliente.repository";
import { ClientePersistenceModel } from "../../models/cliente.persistence.model";

@Injectable()
export class SequelizeClienteRepository
  extends SequelizeBaseRepository<ClienteRecord, ClientePersistenceModel>
  implements ClienteRepository
{
  constructor(
    @InjectModel(ClientePersistenceModel)
    model: typeof ClientePersistenceModel,
  ) {
    super(model);
  }

  protected toRecord(row: ClientePersistenceModel): ClienteRecord {
    return { id: row.id, name: row.name, telefone: row.telefone };
  }
}
