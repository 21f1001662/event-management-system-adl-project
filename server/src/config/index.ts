import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'adl_project',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'access-secret',
    refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh-secret',
    accessExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
  },
  frontendHost: process.env.FRONTEND_HOST || 'http://localhost:5173',
};
