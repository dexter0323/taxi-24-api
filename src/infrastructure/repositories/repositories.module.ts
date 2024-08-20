import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseTodoRepository } from './todo.repository';
import { DatabaseUserRepository } from './user.repository';

import { TypeOrmConfigModule } from 'src/infrastructure/config/typeorm/typeorm.module';
import { Todo } from 'src/infrastructure/entities/todo.entity';
import { User } from 'src/infrastructure/entities/user.entity';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([Todo, User])],
  providers: [DatabaseTodoRepository, DatabaseUserRepository],
  exports: [DatabaseTodoRepository, DatabaseUserRepository],
})
export class RepositoriesModule {}
