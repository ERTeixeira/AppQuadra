# Backend Architecture - AppQuadra

## Visão Geral

O backend do AppQuadra foi refatorado para seguir a mesma arquitetura do **Core-ERP**, implementando uma estrutura em camadas clean e escalável.

## 📁 Estrutura de Pastas

```
backend/
├── src/
│   ├── common/                    # Módulos compartilhados globais
│   │   ├── database/              # Configuração de banco de dados
│   │   └── http/                  # Cliente HTTP
│   │
│   ├── modules/                   # Módulos de domínio
│   │   ├── agendamento/           # Módulo de Agendamentos
│   │   ├── empresa/                # Módulo de Empresa
│   │   ├── quadra/                # Módulo de Quadra
│   │   └── usuario/               # Módulo de Usuário
│   │
│   ├── app-quadra.module.ts       # Módulo raiz da aplicação
│   └── main.ts                    # Bootstrap da aplicação
│
├── tsconfig.json
├── package.json
└── nest-cli.json
```

## 🏗️ Estrutura de um Módulo

Cada módulo de domínio segue o padrão CQRS + Clean Architecture:

```
modulo/
├── modulo.module.ts               # Definição do módulo NestJS
│
├── api/                           # Camada de Apresentação (HTTP)
│   ├── controllers/               # Controladores das rotas
│   │   └── [entidade]/            # Ex: agendamento/
│   │       └── agendamento-v1.controller.ts
│   └── dto/                       # Data Transfer Objects
│       └── [entidade]/            # Ex: agendamento/
│           ├── agendamento-create.dto.ts
│           ├── agendamento-update.dto.ts
│           ├── agendamento-filter.dto.ts
│           └── agendamento-output.dto.ts
│
├── application/                   # Camada de Aplicação (CQRS)
│   ├── commands/                  # Commands (escrita)
│   │   └── [entidade]/
│   │       ├── agendamento-create.command.ts
│   │       └── agendamento-cancel.command.ts
│   │
│   ├── queries/                   # Queries (leitura)
│   │   └── [entidade]/
│   │       ├── agendamento-get.query.ts
│   │       └── agendamento-list.query.ts
│   │
│   ├── handlers/                  # Command & Query Handlers
│   │   ├── index.ts               # Export dos handlers
│   │   └── [entidade]/
│   │       ├── agendamento-create.command-handler.ts
│   │       └── agendamento-get.query-handler.ts
│   │
│   ├── models/                    # Domain Models
│   │   └── [entidade]/
│   │       └── agendamento.model.ts
│   │
│   ├── interfaces/                # Contratos de interfaces
│   │   └── [entidade]/
│   │       └── agendamento.interface.ts
│   │
│   ├── consumers/                 # Event Consumers (RabbitMQ, etc)
│   ├── enums/                     # Enumerações de domínio
│   └── index.ts                   # Export geral da camada
│
├── domain/                        # Camada de Domínio
│   ├── entities/                  # Entidades de domínio
│   │   └── [entidade]/
│   │       └── agendamento.entity.ts
│   └── interfaces/                # Contratos de domínio
│       └── [entidade]/
│           └── agendamento.repository.ts
│
├── infra/                         # Camada de Infraestrutura
│   ├── repositories/              # Implementação dos repositories
│   │   └── [entidade]/
│   │       └── agendamento.repository.ts
│   │
│   ├── models/                    # Modelos de BD/ORM
│   │   ├── [entidade]/
│   │   └── index.ts
│   │
│   └── migrations/                # Migrações de banco de dados
│       ├── global/
│       └── tenant/
│
├── i18n/                          # Internacionalização
│   └── pt-BR.json                 # Traduções em Português
│
└── docs/                          # Documentação do módulo
```

## 🔄 Padrão CQRS - Command Query Responsibility Segregation

### Fluxo de Escrita (Commands)
```
Controller
    ↓
Command (DTO)
    ↓
CommandHandler
    ↓
Model (Validação e Regras de Negócio)
    ↓
Repository (Persistência)
```

### Fluxo de Leitura (Queries)
```
Controller
    ↓
Query
    ↓
QueryHandler
    ↓
Repository (Busca)
```

## 📋 Camadas Explicadas

### 1. **API Layer** (`api/`)
- **Controllers**: Exponem endpoints HTTP
- **DTOs**: Validação e transferência de dados entre cliente e servidor
  - `*-create.dto.ts`: Para criação
  - `*-update.dto.ts`: Para atualização
  - `*-filter.dto.ts`: Para filtros e buscas
  - `*-output.dto.ts`: Resposta para cliente

### 2. **Application Layer** (`application/`)
- **Commands**: Ações que modificam estado (Create, Update, Delete)
- **Queries**: Ações que apenas leem dados
- **Handlers**: Lógica de caso de uso
  - CommandHandlers: Processam commands
  - QueryHandlers: Processam queries
- **Models**: Validações e regras de negócio (sem persistência)
- **Interfaces**: Contratos para repositories e services
- **Consumers**: Processadores de eventos (RabbitMQ, Kafka, etc)
- **Enums**: Valores constantes (Status, Tipos, etc)

### 3. **Domain Layer** (`domain/`)
- **Entities**: Objetos de domínio com identidade única
- **Interfaces**: Contrato do repositório

### 4. **Infra Layer** (`infra/`)
- **Repositories**: Implementação do acesso a dados
- **Models**: Representação dos dados no BD/ORM
- **Migrations**: Versionamento do schema do banco

### 5. **Common** (`src/common/`)
- **Database**: Configuração e serviço global de BD
- **Http**: Cliente HTTP compartilhado

## 🚀 Como Implementar uma Nova Funcionalidade

Exemplo: Criar novo agendamento

### 1. DTO (api/dto/agendamento/)
```typescript
export class CreateAgendamentoDto {
  quadraId: string;
  usuarioId: string;
  dataHora: Date;
  duracao: number; // em minutos
}

export class AgendamentoOutputDto {
  id: string;
  quadraId: string;
  usuarioId: string;
  dataHora: Date;
  status: string;
}
```

### 2. Command (application/commands/agendamento/)
```typescript
export class CreateAgendamentoCommand {
  constructor(public readonly dto: CreateAgendamentoDto) {}
}
```

### 3. Handler (application/handlers/agendamento/)
```typescript
@CommandHandler(CreateAgendamentoCommand)
export class CreateAgendamentoCommandHandler 
  implements ICommandHandler<CreateAgendamentoCommand> {
  constructor(
    @Inject('IAgendamentoRepository')
    private repository: IAgendamentoRepository,
  ) {}

  async execute(command: CreateAgendamentoCommand): Promise<AgendamentoOutputDto> {
    // Validações
    // Criação do model
    // Persistência
    // Retorno
  }
}
```

### 4. Model (application/models/agendamento/)
```typescript
export class AgendamentoModel {
  static create(dto: CreateAgendamentoDto): Result<Agendamento> {
    // Validações de negócio
    // Retornar Result com sucesso ou erro
  }
}
```

### 5. Repository (infra/repositories/agendamento/)
```typescript
export interface IAgendamentoRepository {
  create(agendamento: Agendamento): Promise<Agendamento>;
  getById(id: string): Promise<Agendamento | null>;
  update(agendamento: Agendamento): Promise<void>;
  delete(id: string): Promise<void>;
}

export class AgendamentoRepository implements IAgendamentoRepository {
  // Implementações query builder/ORM
}
```

### 6. Controller (api/controllers/agendamento/)
```typescript
@Controller('agendamento')
@UseGuards(AuthGuard)
export class AgendamentoV1Controller {
  constructor(private commandBus: CommandBus) {}

  @Post()
  async create(@Body() dto: CreateAgendamentoDto) {
    const command = new CreateAgendamentoCommand(dto);
    return this.commandBus.execute(command);
  }
}
```

### 7. Module (agendamento.module.ts)
```typescript
@Module({
  imports: [CqrsModule],
  controllers: [AgendamentoV1Controller],
  providers: [
    ...agendamentoHandlers,
    ...agendamentoRepositories,
  ],
})
export class AgendamentoModule {}
```

## 🔧 Configuração e Variáveis de Ambiente

Crie um `.env` na raiz do `backend/`:

```env
# Server
APP_PORT=3333
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app_quadra
DB_USER=postgres
DB_PASSWORD=postgres

# JWT (se usar autenticação)
JWT_SECRET=your-secret-key
JWT_EXPIRATION=3600

# RabbitMQ (se usar message queue)
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

## 📚 Referências

- [NestJS Documentation](https://docs.nestjs.com)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/)

## 📝 Próximas Etapas

- [ ] Implementar bancos de dados com TypeORM/Prisma
- [ ] Adicionar validação com decoradores customizados
- [ ] Implementar autenticação JWT
- [ ] Configurar Interceptors para logging
- [ ] Adicionar testes unitários e integração
- [ ] CI/CD com GitHub Actions e Azure
- [ ] Documentação OpenAPI/Swagger
- [ ] Kubernetes deployment
