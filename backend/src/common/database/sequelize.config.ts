import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const sequelizeConfig = (): SequelizeModuleOptions => {
  const environment = process.env.NODE_ENV || 'development';

  return {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'app_quadra',
    autoLoadModels: true,
    synchronize: environment === 'development',
    logging: environment === 'development' ? console.log : undefined,
    models: [],
  };
};
