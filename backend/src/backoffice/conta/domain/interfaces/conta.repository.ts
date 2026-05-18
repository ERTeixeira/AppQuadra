import { BaseRepository } from "../../../../common/repositories/base.repository";

export type ContaRecord = {
  id: string;
  name: string;
  email: string;
  senhaHash: string;
  cnpj: string;
};

export abstract class ContaRepository extends BaseRepository<ContaRecord> {}
