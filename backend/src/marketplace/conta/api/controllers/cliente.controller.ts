import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateClienteCommand } from '../../application/commands/conta/create-cliente.command';
import { ClienteCreateDto } from '../dto/conta/cliente-create.dto';

@ApiTags('Marketplace - Contas')
@Controller('marketplace/contas')
export class ClienteController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar cliente (usuário final)' })
  @ApiCreatedResponse({ description: 'Cliente cadastrado com sucesso.' })
  create(@Body() input: ClienteCreateDto) {
    return this.commandBus.execute(new CreateClienteCommand(input));
  }
}
