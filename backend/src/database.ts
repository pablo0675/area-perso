import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { getFromEnv } from './utils/env';
import { User } from './user/entities/user.entity';
import { UserSettings } from './user/entities/user-setting.entity';
import Service from './service/entities/service.entity';
import Area from './service/entities/area.entity';

// import seed migrations
import { AddRiotService1711470927911 } from './service/seed/1711470927911-add-riot-service';
import UserConnection from './user-connections/entities/user-connection.entity';
import Scope from './service/entities/scope.entity';
import { SetupUserSettings1711447316612 } from './migrations/1711447316612-setup-user-settings';
import Migration1710950053869 from './migrations/1710950053869-migration';

export const DATABASE_CONFIG: DataSourceOptions = {
  type: 'postgres',
  namingStrategy: new SnakeNamingStrategy(),
  host: getFromEnv<string>('DB_HOST'),
  port: getFromEnv<number>('DB_PORT'),
  database: getFromEnv<string>('DB_NAME'),
  username: getFromEnv<string>('DB_USER'),
  password: getFromEnv<string>('DB_PASSWORD'),
  entities: [User, UserSettings, Service, Area, UserConnection, Scope],
  synchronize: true,
  migrations: [
    Migration1710950053869,
    SetupUserSettings1711447316612,
    AddRiotService1711470927911,
  ],
};

export default new DataSource(DATABASE_CONFIG);
