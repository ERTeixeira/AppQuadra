import { NestFactory } from '@nestjs/core';
import { AppQuadraModule } from './app-quadra.module';

/**
 * Bootstrap da aplicação AppQuadra
 * 
 * A aplicação segue a mesma arquitetura do Core-ERP:
 * - Módulos organizados por domínio (Agendamento, Empresa, Quadra, Usuario)
 * - Cada módulo com sua estrutura (api, application, domain, infra)
 * - Transporte via REST API com prefixo /api
 */
async function bootstrap() {
  const app = await NestFactory.create(AppQuadraModule);
  
  // Configurar prefixo global
  app.setGlobalPrefix('api');
  
  // Iniciar aplicação
  const port = process.env.APP_PORT || 3333;
  await app.listen(port);
  
  console.log(`🚀 AppQuadra rodando em http://localhost:${port}/api`);
}

bootstrap().catch((err) => {
  console.error('Erro ao iniciar aplicação:', err);
  process.exit(1);
});
