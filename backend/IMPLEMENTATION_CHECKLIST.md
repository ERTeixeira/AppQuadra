# 📝 Checklist de Implementação - AppQuadra Backend

## ✅ Refatoração Concluída

### Estrutura Base
- [x] Reorganizar pastas (remover `infrastructure/` e `domain/` antigas)
- [x] Mover serviços globais para `src/common/`
- [x] Criar `app-quadra.module.ts` como módulo raiz
- [x] Atualizar `main.ts` com bootstrap correto

### Módulos
- [x] **Agendamento** - Estrutura completa + exemplos
  - [x] DTOs (Create, Update, Filter, Output)
  - [x] Commands (Create, Cancel, Update)
  - [x] Queries (Get, List, CheckDisponibilidade)
  - [x] Handler exemplo (CreateAgendamentoCommandHandler)
  - [x] Repository interface e implementação in-memory
  - [x] Model com regras de negócio
  - [x] Controller v1
  
- [x] **Empresa** - Estrutura completa (pronto para implementar)
- [x] **Quadra** - Estrutura completa (pronto para implementar)
- [x] **Usuario** - Estrutura completa (pronto para implementar)

### Arquivos de Configuração
- [x] `.env.example` - Template de variáveis de ambiente
- [x] `ARCHITECTURE.md` - Documentação arquitetura
- [x] `CONFIG.md` - Guia de configuração
- [x] `README.md` - Overview
- [x] `REFACTORING_SUMMARY.md` - Resumo da refatoração

---

## ⏳ Próximas Etapas Recomendadas

### Fase 1: Banco de Dados (Semana 1)
- [ ] Instalar TypeORM ou Prisma
- [ ] Configurar conexão PostgreSQL
- [ ] Criar migrations para Agendamento
- [ ] Implementar PostgresAgendamentoRepository
- [ ] Testes unitários do repository

### Fase 2: Modularização Completa (Semana 2)
- [ ] Implementar handlers para Empresa
  - [ ] CreateEmpresa, UpdateEmpresa, DeleteEmpresa handlers
  - [ ] GetEmpresa, ListEmpresas query handlers
- [ ] Implementar handlers para Quadra
- [ ] Implementar handlers para Usuario
- [ ] Criar DTOs e repositórios para cada módulo

### Fase 3: Autenticação & Autorização (Semana 3)
- [ ] Instalar @nestjs/jwt e @nestjs/passport
- [ ] Implementar estratégia JWT
- [ ] Adicionar decorators @UseGuards(JwtAuthGuard)
- [ ] Implementar refresh tokens
- [ ] Configurar roles e permissions

### Fase 4: Qualidade & Observabilidade (Semana 4)
- [ ] Setup Jest para testes unitários
- [ ] Testes dos handlers
- [ ] Testes dos controllers
- [ ] Adicionar Sentry para monitoring
- [ ] Configurar logs estruturados

### Fase 5: Deployment (Semana 5)
- [ ] Criar Dockerfile
- [ ] Setup Kubernetes manifests
- [ ] Configurar Azure Pipelines
- [ ] Setup CI/CD

---

## 📖 Como Implementar uma Entidade

### Exemplo: Criar handlers para Empresa

#### 1. DTOs (`api/dto/empresa/empresa.dto.ts`)
```typescript
export interface CreateEmpresaDto {
  nome: string;
  cnpj: string;
  endereco: string;
}
```

#### 2. Commands (`application/commands/empresa/empresa.command.ts`)
```typescript
export class CreateEmpresaCommand {
  constructor(readonly dto: CreateEmpresaDto) {}
}
```

#### 3. Model (`application/models/empresa/empresa.model.ts`)
```typescript
export class EmpresaModel {
  static create(dto: CreateEmpresaDto): EmpresaModel {
    // Validações de negócio
    return new EmpresaModel(data);
  }
}
```

#### 4. Handler (`application/handlers/empresa/create-empresa.handler.ts`)
```typescript
@CommandHandler(CreateEmpresaCommand)
export class CreateEmpresaCommandHandler {
  constructor(
    @Inject('IEmpresaRepository')
    private repository: IEmpresaRepository,
  ) {}

  async execute(command: CreateEmpresaCommand) {
    const model = EmpresaModel.create(command.dto);
    return this.repository.create(model.data);
  }
}
```

#### 5. Repository (`infra/repositories/empresa/empresa.repository.ts`)
```typescript
export class EmpresaRepository implements IEmpresaRepository {
  async create(empresa: EmpresaData): Promise<EmpresaData> {
    // Implementar com TypeORM/Prisma
  }
}
```

#### 6. Controller (`api/controllers/empresa/empresa-v1.controller.ts`)
```typescript
@Controller('empresa')
export class EmpresaV1Controller {
  @Post()
  async create(@Body() dto: CreateEmpresaDto) {
    const command = new CreateEmpresaCommand(dto);
    return this.commandBus.execute(command);
  }
}
```

#### 7. Registrar no Module
```typescript
@Module({
  providers: [
    CreateEmpresaCommandHandler,
    // ... outros handlers
    { provide: 'IEmpresaRepository', useClass: EmpresaRepository }
  ],
})
export class EmpresaModule {}
```

---

## 🧪 Testes Recomendados

### Unit Tests
```typescript
describe('CreateEmpresaCommandHandler', () => {
  it('should create empresa successfully', async () => {
    const handler = new CreateEmpresaCommandHandler(repository);
    const result = await handler.execute(command);
    expect(result.id).toBeDefined();
  });
});
```

### E2E Tests
```bash
npm run test:e2e -- --testPathPattern=agendamento
```

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia com watch mode

# Build
npm run build            # Compila TypeScript

# Testes
npm test                 # Unit tests
npm run test:cov         # Coverage
npm run test:e2e         # E2E tests

# Linting
npm run lint             # ESLint
npm run format           # Prettier

# Database
npm run typeorm:generate # Gera migration
npm run typeorm:run      # Executa migrations
```

---

## 📚 Referências

- [NestJS Docs](https://docs.nestjs.com)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [TypeORM Docs](https://typeorm.io)
  
---

## 🎯 Métricas de Sucesso

- ✅ 4 módulos bem estruturados
- ✅ CQRS implementado
- ✅ Testes em 80%+ do código
- ✅ Deploy automático com CI/CD
- ✅ Zero downtime durante updates

---

## 📞 Dúvidas?

Consulte:
1. **ARCHITECTURE.md** - Para entender a estrutura
2. **src/modules/agendamento/** - Para ver exemplo completo
3. **Exemplos de handlers** - Copie e adapte o padrão

**Status**: ✅ Backend ready for development
