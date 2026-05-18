import { CreateClienteHandler } from './conta/create-cliente.handler';
import { GetClienteByTelefoneHandler } from './conta/get-cliente-by-telefone.handler';

export const clienteCommandHandlers = [CreateClienteHandler];
export const clienteQueryHandlers = [GetClienteByTelefoneHandler];
export const clienteHandlers = [...clienteCommandHandlers, ...clienteQueryHandlers];
