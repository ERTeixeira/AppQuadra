import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { HttpModule } from './common/http/http.module';

import { UsuarioModule } from './modules/usuario/usuario.module';

/**
 * AppQuadra Main Module
 * Organiza todos os módulos de domínio seguindo a arquitetura do Core-ERP
 * 
 * Módulos Importados:
 * - DatabaseModule: Configuração de banco de dados (Global)
 * - HttpModule: Configuração de requisições HTTP
 * - Módulos de Domínio: Agendamento, Empresa, Quadra, Usuario
 */
@Module({
  imports: [
    // Global/Common Modules
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HttpModule,

    // Domain Modules
    UsuarioModule,
  ],
})
export class AppQuadraModule {}
