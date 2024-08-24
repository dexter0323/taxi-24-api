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
import { DatabaseTripRepository } from 'src/infrastructure/repositories/trip.repository';
import { Trip } from 'src/infrastructure/entities/trip.entity';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([User, Driver, Passenger, Trip])],
  providers: [
    DatabaseUserRepository,
    DatabaseDriverRepository,
    DatabasePassengerRepository,
    DatabaseTripRepository,
    BcryptService,
  ],
  exports: [
    DatabaseUserRepository,
    DatabaseDriverRepository,
    DatabasePassengerRepository,
    DatabaseTripRepository,
  ],
})
export class RepositoriesModule {}
