/**
 * Usuario Application Layer - Handlers Index
 * 
 * Implementação dos handlers para commands e queries
 */

import { GetAllUsuariosHandler } from './usuario/get-all-usuarios.handler';

export const usuarioCommandHandlers = [];
export const usuarioQueryHandlers = [GetAllUsuariosHandler];
export const usuarioHandlers = [
  ...usuarioCommandHandlers,
  ...usuarioQueryHandlers,
];
