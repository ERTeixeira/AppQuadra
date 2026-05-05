# @quadra/shared - Estrutura de Pastas

## Organização

```
src/
├── database/              # Tudo relacionado a persistência
│   ├── interfaces/        # IDocumentData e interfaces de banco
│   │   ├── document-data.interface.ts
│   │   └── index.ts
│   ├── models/            # Modelos base (DocumentData)
│   │   ├── document-data.ts
│   │   └── index.ts
│   └── index.ts           # Exports de database/
│
├── decorators/            # Validação de DTOs
│   ├── validation.decorators.ts
│   ├── validation-message.ts
│   └── index.ts
│
├── types/                 # Tipos utilitários
│   ├── result.ts          # Tipo Result<T>
│   └── types.ts           # Tipos genéricos (Identifier, Pagination, etc)
│
├── constants/             # Constantes compartilhadas
│
└── index.ts              # Arquivo principal de exports
```

## Importações

### ✅ Correto - Importar do @quadra/shared

```typescript
// Decorators
import { StringRequired, EmailRequired } from '@quadra/shared';

// Database
import { DocumentData, IDocumentData } from '@quadra/shared';

// Types
import { Result } from '@quadra/shared';
```

### ❌ Evitar - Importar de arquivos específicos

```typescript
// Não fazer isso
import { StringRequired } from '@quadra/shared/decorators/validation.decorators';
import { DocumentData } from '@quadra/shared/database/models/document-data';
```

## Responsabilidades por Pasta

### `/database`
- Interfaces para estrutura de dados
- Modelos base para entidades
- Tipos relacionados a persistência
- Exemplo: `DocumentData`, `IDocumentData`

### `/decorators`
- Validation decorators para class-validator
- Funções auxiliares de validação
- Mensagens de validação i18n
- Exemplo: `@StringRequired()`, `@EmailRequired()`

### `/types`
- Tipos genéricos reutilizáveis
- Result pattern para tratamento de erros
- Tipos utilitários
- Exemplo: `Result<T>`, `Pagination`

### `/constants`
- Constantes do projeto
- Valores compartilhados entre módulos

## Como Adicionar Novos Itens

### Novo Decorator
1. Adicionar em `/decorators/validation.decorators.ts`
2. Exportado automaticamente via `/decorators/index.ts`

### Nova Interface de Database
1. Criar arquivo em `/database/interfaces/`
2. Exportar em `/database/interfaces/index.ts`

### Novo Tipo
1. Adicionar em `/types/` como arquivo separado
2. Exportar em `/types.ts`

## Build & Test

```bash
cd libs/shared
npm install
npm run build
```
