import { CreateClienteHandler } from "./conta/create-cliente.handler";

export const clienteCommandHandlers = [CreateClienteHandler];
export const clienteHandlers = [...clienteCommandHandlers];
