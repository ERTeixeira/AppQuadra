export type ClienteRecord = {
  id: string;
  name: string;
  telefone: string;
};

export abstract class ClienteRepository {
  abstract save(cliente: ClienteRecord): Promise<void>;
  abstract findAll(): Promise<ClienteRecord[]>;
  abstract findByTelefone(telefone: string): Promise<ClienteRecord | null>;
  abstract findById(id: string): Promise<ClienteRecord | null>;
}
