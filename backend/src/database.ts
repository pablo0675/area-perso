import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { getFromEnv } from './utils/env';
import { User } from './user/entities/user.entity';
import { UserSettings } from './user/entities/user-setting.entity';
import { UserToken } from './user/entities/user-token.entity';

export const DATABASE_CONFIG: DataSourceOptions = {
  type: 'postgres',
  namingStrategy: new SnakeNamingStrategy(),
  host: getFromEnv<string>('DB_HOST'),
  port: getFromEnv<number>('DB_PORT'),
  database: getFromEnv<string>('DB_NAME'),
  username: getFromEnv<string>('DB_USER'),
  password: getFromEnv<string>('DB_PASSWORD'),
  entities: [User, UserSettings, UserToken],
  synchronize: true,
  migrations: ['src/migrations/*.ts'],
};

export default new DataSource(DATABASE_CONFIG);
