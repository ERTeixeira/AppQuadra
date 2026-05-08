/**
 * Usuario Application Layer - Handlers Index
 * 
 * Implementação dos handlers para commands e queries
 */

import { CreateUsuarioHandler } from './usuario/create-usuario.command-handler';
import { GetAllUsuariosHandler } from './usuario/get-all-usuarios.handler';

export const usuarioCommandHandlers = [CreateUsuarioHandler];
export const usuarioQueryHandlers = [GetAllUsuariosHandler];
export const usuarioHandlers = [
  ...usuarioCommandHandlers,
  ...usuarioQueryHandlers,
];
