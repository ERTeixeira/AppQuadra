import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from './sequelize.config';

/**
 * DatabaseModule - Configuração Global de Banco de Dados
 * 
 * Módulo global responsável pela configuração do Sequelize com PostgreSQL.
 * Utiliza variáveis de ambiente para configuração de conexão.
 * 
 * Variáveis de ambiente esperadas:
 * - DB_HOST: Host do banco de dados
 * - DB_PORT: Porta do banco de dados
 * - DB_USER: Usuário do banco de dados
 * - DB_PASSWORD: Senha do banco de dados
 * - DB_NAME: Nome do banco de dados
 * - NODE_ENV: Ambiente (development/production)
 */
@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: () => sequelizeConfig(),
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
