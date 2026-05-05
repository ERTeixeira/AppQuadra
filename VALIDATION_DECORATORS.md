# Validation Decorators

Decorators de validação para DTOs sem prefixo "Sis", importáveis da lib `@quadra/shared`.

## Instalação

Os decorators já estão disponíveis na lib compartilhada `@quadra/shared`.

```typescript
import {
  StringRequired,
  StringOptional,
  UuidRequired,
  EmailRequired,
  // ... outros decorators
} from '@quadra/shared';
```

## Decorators Disponíveis

### String
- **`StringRequired(label, min, max)`** - String obrigatória
- **`StringOptional(label, min, max)`** - String opcional

### UUID
- **`UuidRequired(label)`** - UUID obrigatório
- **`UuidOptional(label, requireIfPresent)`** - UUID opcional
- **`UuidArrayRequired(label)`** - Array de UUID obrigatório
- **`UuidArrayOptional(label)`** - Array de UUID opcional

### Data
- **`DateRequired(label, min, max)`** - Data obrigatória (formato: YYYY-MM-DD)
- **`DateOptional(label, min, max, requireIfPresent)`** - Data opcional
- **`DateTimeRequired(label)`** - Data/hora obrigatória
- **`DateTimeOptional(label)`** - Data/hora opcional

### Números
- **`IntegerRequired(label, min, max)`** - Inteiro obrigatório
- **`IntegerOptional(label, min, max)`** - Inteiro opcional
- **`DecimalRequired(label, decimals, min, max)`** - Decimal obrigatório
- **`DecimalOptional(label, decimals, min, max)`** - Decimal opcional

### Booleano
- **`BooleanRequired(label)`** - Booleano obrigatório
- **`BooleanOptional(label)`** - Booleano opcional

### Enum
- **`EnumRequired(label, enumType)`** - Enum obrigatório
- **`EnumOptional(label, enumType)`** - Enum opcional
- **`EnumArrayRequired(label, enumType)`** - Array de Enum obrigatório
- **`EnumArrayOptional(label, enumType)`** - Array de Enum opcional

### Contato
- **`EmailRequired(label)`** - Email obrigatório
- **`EmailOptional(label, requireIfPresent)`** - Email opcional
- **`PhoneRequired(label, min, max)`** - Telefone obrigatório
- **`PhoneOptional(label, min, max, requireIfPresent)`** - Telefone opcional

### Documentos
- **`CpfRequired(label)`** - CPF obrigatório (valida formato)
- **`CpfOptional(label, requireIfPresent)`** - CPF opcional
- **`CnpjRequired(label)`** - CNPJ obrigatório (valida formato)
- **`CnpjOptional(label, requireIfPresent)`** - CNPJ opcional
- **`PassportRequired(label, min, max)`** - Passaporte obrigatório
- **`PassportOptional(label, requireIfPresent, min, max)`** - Passaporte opcional

### Validações Customizadas
- **`AtLeastOneItemArray(properties, translationKey)`** - Valida que pelo menos um array tem conteúdo
- **`CannotClearAllFields(properties, translationKey)`** - Valida que não todos os campos foram limpos
- **`AtLeastOneField(properties, translationKey)`** - Valida que pelo menos um campo foi preenchido

## Exemplos

### DTO Simples

```typescript
import {
  StringRequired,
  UuidRequired,
  EmailRequired,
  PhoneOptional,
} from '@quadra/shared';

export class CreateEmpresaDto {
  @UuidRequired('empresa.id')
  id: string;

  @StringRequired('empresa.nome', 3, 100)
  nome: string;

  @EmailRequired('empresa.email')
  email: string;

  @PhoneOptional('empresa.telefone', 11, 11)
  telefone?: string;
}
```

### DTO com Enum

```typescript
import { EnumRequired, EnumOptional } from '@quadra/shared';

enum StatusEnum {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
}

export class UpdateEmpresaDto {
  @EnumRequired('empresa.status', StatusEnum)
  status: StatusEnum;

  @EnumOptional('empresa.tipo', TipoEnum)
  tipo?: TipoEnum;
}
```

### DTO com Validações Compostas

```typescript
import { AtLeastOneField, CpfOptional, PassportOptional } from '@quadra/shared';

export class CreatePessoaDto {
  @StringRequired('pessoa.nome')
  nome: string;

  @AtLeastOneField(['cpf', 'passaporte'], 'pessoa.cpfOuPassaporte')
  cpf?: string;

  @CpfOptional('pessoa.cpf')
  cpf?: string;

  @PassportOptional('pessoa.passaporte')
  passaporte?: string;
}
```

## Notas

1. **Parâmetro `label`**: É a chave para tradução (i18n) que será usada para mensagens de erro
2. **Parâmetro `requireIfPresent`**: Se `true`, o campo será obrigatório se enviado; se `false`, pode ser vazio
3. **Transformação automática**: Todos os decorators fazem trim() em strings automaticamente
4. **Mensagens de erro**: As mensagens vêm do arquivo `validation-message.ts` e seguem padrão i18n

## Integração com NestJS

Os decorators funcionam nativamente com NestJS quando usado em DTOs com o `@Body()`:

```typescript
import { Post, Body } from '@nestjs/common';
import { CreateUsuarioDto } from './create-usuario.dto';

@Post()
create(@Body() createUsuarioDto: CreateUsuarioDto) {
  // O NestJS valida automaticamente usando class-validator
  return this.usuarioService.create(createUsuarioDto);
}
```

O NestJS usará automaticamente os decorators de validação (`class-validator`) presentes no DTO.
