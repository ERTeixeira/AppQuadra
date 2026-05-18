import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { SequelizeBaseRepository } from "../../../../../common/repositories/sequelize-base.repository";
import {
  ContaRecord,
  ContaRepository,
} from "../../../domain/interfaces/conta.repository";
import { ContaPersistenceModel } from "../../models/conta.persistence.model";

@Injectable()
export class SequelizeContaRepository
  extends SequelizeBaseRepository<ContaRecord, ContaPersistenceModel>
  implements ContaRepository
{
  constructor(
    @InjectModel(ContaPersistenceModel)
    model: typeof ContaPersistenceModel,
  ) {
    super(model);
  }

  protected toRecord(row: ContaPersistenceModel): ContaRecord {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      senhaHash: row.senhaHash,
      cnpj: row.cnpj,
    };
  }
}
