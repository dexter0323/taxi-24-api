import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseUserRepository } from './user.repository';

import { TypeOrmConfigModule } from 'src/infrastructure/config/typeorm/typeorm.module';
import { Driver } from 'src/infrastructure/entities/driver.entity';
import { Passenger } from 'src/infrastructure/entities/passenger.entity';
import { User } from 'src/infrastructure/entities/user.entity';
import { DatabaseDriverRepository } from 'src/infrastructure/repositories/driver.repository';
import { DatabasePassengerRepository } from 'src/infrastructure/repositories/passenger.repository';
import { BcryptService } from 'src/infrastructure/services/bcrypt/bcrypt.service';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([User, Driver, Passenger])],
  providers: [
    DatabaseUserRepository,
    DatabaseDriverRepository,
    DatabasePassengerRepository,
    BcryptService,
  ],
  exports: [DatabaseUserRepository, DatabaseDriverRepository, DatabasePassengerRepository],
})
export class RepositoriesModule {}
