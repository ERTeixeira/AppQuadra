export type ContaRecord = {
  id: string;
  name: string;
  email: string;
  senhaHash: string;
  cnpj: string;
};

export abstract class ContaRepository {
  abstract save(conta: ContaRecord): Promise<void>;
  abstract findAll(): Promise<ContaRecord[]>;
  abstract findByEmail(email: string): Promise<ContaRecord | null>;
  abstract findByCnpj(cnpj: string): Promise<ContaRecord | null>;
  abstract findById(id: string): Promise<ContaRecord | null>;
}
