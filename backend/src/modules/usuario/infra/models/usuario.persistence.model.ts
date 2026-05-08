export interface UsuarioPersistenceModel {
  empresaId: string;
  name: string;
  email: string;
  role: string;
  telefone?: string;
  observacoes?: string;
}
