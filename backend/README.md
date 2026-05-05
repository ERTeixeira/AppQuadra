# AppQuadra Backend

Backend da aplicação **AppQuadra** seguindo a arquitetura do Core-ERP.

## 📋 Estrutura

- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md) - Descrição da arquitetura CQRS
- **Configuration**: [CONFIG.md](./CONFIG.md) - Guia de configuração
- **src/modules**: Módulos de domínio (Agendamento, Empresa, Quadra, Usuario)
- **src/common**: Módulos compartilhados (Database, HTTP)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build
npm start
```

## 📁 Projeto

```
src/
├── common/              # Módulos globais
├── modules/             # Módulos de domínio
├── app-quadra.module.ts # Módulo raiz
└── main.ts             # Bootstrap
```

## 🏗️ Módulos Disponíveis

- **Agendamento**: Gerenciamento de agendamentos de quadra
- **Empresa**: Dados e configurações da empresa
- **Quadra**: Informações de quadras disponíveis
- **Usuario**: Gestão de usuários do sistema

## 📚 Documentação

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para entender:
- Organização de pastas
- Padrão CQRS
- Como implementar novas funcionalidades
- Camadas da aplicação

## 📝 Próximas Etapas

- Implementar persistência de dados (BD)
- Adicionar autenticação e autorização
- Implementar testes
- Configurar CI/CD
- Deploy em Kubernetes
