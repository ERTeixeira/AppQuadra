import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContaController } from './api/controllers/conta.controller';
import { contaHandlers } from './application/handlers';
import { ContaPersistenceModel } from './infra/models/conta.persistence.model';
import { SequelizeContaRepository } from './infra/repositories/conta/sequelize-conta.repository';

@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([ContaPersistenceModel])],
  controllers: [ContaController],
  providers: [
    ...contaHandlers,
    { provide: 'IContaRepository', useClass: SequelizeContaRepository },
  ],
  exports: ['IContaRepository'],
})
export class BackofficeContaModule {}
