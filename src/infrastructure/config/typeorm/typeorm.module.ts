import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvironmentConfigModule } from 'src/infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';

export const getTypeOrmModuleOptions = (
  config: EnvironmentConfigService,
): TypeOrmModuleOptions => {
  switch (config.getDatabaseType()) {
    case 'postgres':
      return {
        type: 'postgres',
        host: config.getDatabaseHost(),
        port: config.getDatabasePort(),
        username: config.getDatabaseUser(),
        password: config.getDatabasePassword(),
        database: config.getDatabaseName(),
        entities: [__dirname + './../../**/*.entity{.ts,.js}'],
        synchronize: false,
        schema: process.env.DATABASE_SCHEMA,
        migrationsRun: true,
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        // ssl: { rejectUnauthorized: false },
      };
  }
};
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: getTypeOrmModuleOptions,
    }),
  ],
})
export class TypeOrmConfigModule {}
