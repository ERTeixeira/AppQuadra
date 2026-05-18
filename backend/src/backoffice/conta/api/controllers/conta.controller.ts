import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateContaCommand } from '../../application/commands/conta/create-conta.command';
import { GetAllContasQuery } from '../../application/queries/conta/get-all-contas.query';
import { ContaCreateDto } from '../dto/conta/conta-create.dto';

@ApiTags('Backoffice - Contas')
@Controller('backoffice/contas')
export class ContaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar conta de proprietário' })
  @ApiCreatedResponse({ description: 'Conta criada com sucesso.' })
  create(@Body() input: ContaCreateDto) {
    return this.commandBus.execute(new CreateContaCommand(input));
  }

  @Get()
  @ApiOperation({ summary: 'Listar contas de proprietários' })
  @ApiOkResponse({ description: 'Lista retornada com sucesso.' })
  list() {
    return this.queryBus.execute(new GetAllContasQuery());
  }
}
