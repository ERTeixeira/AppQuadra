import { BaseRepository } from "../../../../common/repositories/base.repository";

export type ClienteRecord = {
  id: string;
  name: string;
  telefone: string;
};

export abstract class ClienteRepository extends BaseRepository<ClienteRecord> {}
