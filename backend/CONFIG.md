# AppQuadra Backend Configuration

## Environment Setup

### Copy .env.example to .env
```bash
cp .env.example .env
```

### Development Environment
```bash
npm install
npm run start:dev
```

### Production Build
```bash
npm run build
npm start
```

## Database Configuration (PostgreSQL + Sequelize)

### Prerequisites
- PostgreSQL 12 ou superior instalado e rodando
- Credenciais do PostgreSQL disponíveis

### Environment Variables
Editar o arquivo `.env` com as credenciais do seu PostgreSQL:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=app_quadra
NODE_ENV=development
```

### Database Setup
1. Criar o banco de dados
```bash
createdb app_quadra
```

2. O Sequelize sincronizará as tabelas automaticamente em desenvolvimento (synchronize: true)

### Sequelize CLI (Opcional - para gerenciamento avançado)
```bash
# Instalar sequelize-cli se necessário
npm install --save-dev sequelize-cli

# Gerar uma migration
npx sequelize-cli migration:generate --name migration_name

# Executar migrations
npx sequelize-cli db:migrate
```

## Docker

### Build Docker Image
```bash
docker build -t app-quadra-backend .
```

### Run Container com PostgreSQL
```bash
# Executar PostgreSQL em container
docker run --name app-quadra-db -e POSTGRES_DB=app_quadra -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16

# Executar a aplicação
docker run -p 3333:3333 --env-file .env --link app-quadra-db -e DB_HOST=app-quadra-db app-quadra-backend
```

### Docker Compose (Recomendado)
Criar arquivo `docker-compose.yml`:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: app_quadra
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "3333:3333"
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: postgres
      DB_NAME: app_quadra
      NODE_ENV: development
    depends_on:
      - postgres

volumes:
  postgres_data:
```

Executar:
```bash
docker-compose up
```

## Testing

```bash
npm run test           # Unit tests
npm run test:e2e       # E2E tests
npm run test:cov       # Coverage report
```
