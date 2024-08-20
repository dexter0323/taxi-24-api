import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { readFileSync } from 'fs';

if (process.env.NODE_ENV === 'local') {
  dotenv.config({
    path: path.resolve(__dirname, '../../../../', '.env.local'),
  });
}

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SCHEMA == 'true',
  schema: process.env.DB_SCHEMA,
  entities: [__dirname + './../../**/*.entity{.ts,.js}'],
  migrationsRun: true,
  migrationsTableName: 'migration_todo',
  migrations: ['database/migrations/**/*{.ts,.js}'],
  // ssl: { rejectUnauthorized: false },
});

export default dataSource;
