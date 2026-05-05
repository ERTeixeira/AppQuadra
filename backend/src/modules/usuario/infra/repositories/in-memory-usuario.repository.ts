import { Injectable } from '@nestjs/common';
import { UsuarioRecord, UsuarioRepository } from '../../domain/interfaces/usuario.repository';
import { UsuarioPersistenceModel } from '../models/usuario.persistence.model';

@Injectable()
export class InMemoryUsuarioRepository implements UsuarioRepository {
  private usuarios: UsuarioPersistenceModel[] = [];

  async save(usuario: UsuarioRecord): Promise<void> {
    const persistenceModel: UsuarioPersistenceModel = {
      name: usuario.name,
      email: usuario.email,
      role: usuario.role,
    };

    this.usuarios.push(persistenceModel);
  }

  async findAll(): Promise<UsuarioRecord[]> {
    return this.usuarios;
  }
}
