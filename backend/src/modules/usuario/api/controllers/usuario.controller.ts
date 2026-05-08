import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUsuarioCommand } from '../../application/commands/usuario/create-usuario.command';
import { GetAllUsuariosQuery } from '../../application/queries/usuario/get-all-usuarios.query';
import { UsuarioCreateDto } from '../dto/usuario/usuario-create.dto';

@ApiTags('Usuários')
@Controller('usuarios')
export class UsuarioController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar usuário', description: 'Cria um novo usuário no sistema.' })
  @ApiCreatedResponse({ description: 'Usuário criado com sucesso.' })
  create(@Body() input: UsuarioCreateDto) {
    return this.commandBus.execute(
      new CreateUsuarioCommand(
        input
      ),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuários', description: 'Retorna todos os usuários cadastrados.' })
  @ApiOkResponse({ description: 'Lista de usuários retornada com sucesso.' })
  list() {
    return this.queryBus.execute(new GetAllUsuariosQuery());
  }
}

