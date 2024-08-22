import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseTodoRepository } from './todo.repository';
import { DatabaseUserRepository } from './user.repository';

import { TypeOrmConfigModule } from 'src/infrastructure/config/typeorm/typeorm.module';
import { Driver } from 'src/infrastructure/entities/driver.entity';
import { Todo } from 'src/infrastructure/entities/todo.entity';
import { User } from 'src/infrastructure/entities/user.entity';
import { DatabaseDriverRepository } from 'src/infrastructure/repositories/driver.repository';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([Todo, User, Driver])],
  providers: [DatabaseTodoRepository, DatabaseUserRepository, DatabaseDriverRepository],
  exports: [DatabaseTodoRepository, DatabaseUserRepository, DatabaseDriverRepository],
})
export class RepositoriesModule {}
