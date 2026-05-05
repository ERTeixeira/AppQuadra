export type UsuarioRecord = {
  name: string;
  email: string;
  role: string;
};

export abstract class UsuarioRepository {
  abstract save(usuario: UsuarioRecord): Promise<void>;
  abstract findAll(): Promise<UsuarioRecord[]>;
}
