import { DataSource } from 'typeorm';
import { config } from './index';
import { User } from '../entities/User';
import { Event } from '../entities/Event';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: config.nodeEnv === 'development', // Set to false in production
  logging: config.nodeEnv === 'development',
  entities: [User, Event],
  subscribers: [],
  migrations: [],
});
