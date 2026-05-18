import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClienteController } from './api/controllers/cliente.controller';
import { clienteHandlers } from './application/handlers';
import { ClientePersistenceModel } from './infra/models/cliente.persistence.model';
import { SequelizeClienteRepository } from './infra/repositories/conta/sequelize-cliente.repository';

@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([ClientePersistenceModel])],
  controllers: [ClienteController],
  providers: [
    ...clienteHandlers,
    { provide: 'IClienteRepository', useClass: SequelizeClienteRepository },
  ],
  exports: ['IClienteRepository'],
})
export class MarketplaceContaModule {}
