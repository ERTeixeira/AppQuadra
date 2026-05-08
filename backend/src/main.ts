import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // Validação global de DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('AppQuadra API')
    .setDescription('Documentação da API do AppQuadra')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Iniciar aplicação
  const port = process.env.APP_PORT || 3333;
  await app.listen(port);
  
  console.log(`🚀 AppQuadra rodando em http://localhost:${port}/swagger`);
}

bootstrap().catch((err) => {
  console.error('Erro ao iniciar aplicação:', err);
  process.exit(1);
});
