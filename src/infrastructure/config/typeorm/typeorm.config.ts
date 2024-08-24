import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';

dotenv.config({
  path: path.resolve(__dirname, '../../../../', process.env.ENV_FILE_PATH || '.env'),
});

if (!process.env.DB_TYPE) throw new Error('Database type not specified');

let dataSource: DataSource;

switch (process.env.DB_TYPE) {
  case 'postgres':
    dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: process.env.DB_SYNC === 'true',
      schema: process.env.DB_SCHEMA,
      entities: [__dirname + './../../**/*.entity{.ts,.js}'],
      migrationsRun: true,
      migrations: ['database/migrations/**/*{.ts,.js}'],
      // ssl: { rejectUnauthorized: false },
    });
}

if (!dataSource) throw new Error(`${process.env.DB_TYPE} Database type not support implemented`);

export default dataSource;
