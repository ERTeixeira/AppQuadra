import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsuarioController } from './api/controllers/usuario.controller';
import { usuarioHandlers } from './application/handlers';
import { UsuarioModel } from './infra/models/usuario/usuario.model';
import { SequelizeUsuarioRepository } from './infra/repositories/usuario/sequelize-usuario.repository';

@Module({
  imports: [
    CqrsModule,
    SequelizeModule.forFeature([UsuarioModel]),
  ],
  controllers: [UsuarioController],
  providers: [
    ...usuarioHandlers,
    {
      provide: 'IUsuarioRepository',
      useClass: SequelizeUsuarioRepository,
    },
  ],
  exports: ['IUsuarioRepository'],
})
export class UsuarioModule {}
