import { CreateContaHandler } from './conta/create-conta.handler';
import { GetAllContasHandler } from './conta/get-all-contas.handler';

export const contaCommandHandlers = [CreateContaHandler];
export const contaQueryHandlers = [GetAllContasHandler];
export const contaHandlers = [...contaCommandHandlers, ...contaQueryHandlers];
