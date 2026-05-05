import { Body, Controller, Get, Post } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllUsuariosQuery } from '../../application/queries/usuario/get-all-usuarios.query';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly queryBus: QueryBus) {}

  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return { message: 'Usuário criado', data: dto };
  }

  @Get()
  list() {
    return this.queryBus.execute(new GetAllUsuariosQuery());
  }
}
