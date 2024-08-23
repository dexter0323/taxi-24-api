import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PassengerRepository } from 'src/domain/repositories/passengerRepository.interface';
import { PassengerM } from 'src/domain/model/passenger';
import { Passenger } from 'src/infrastructure/entities/passenger.entity';
import { DriverM } from 'src/domain/model/driver';
import { Driver } from 'src/infrastructure/entities/driver.entity';
import { DatabaseDriverRepository } from 'src/infrastructure/repositories/driver.repository';

@Injectable()
export class DatabasePassengerRepository implements PassengerRepository {
  constructor(
    @InjectRepository(Passenger)
    private readonly passengerEntityRepository: Repository<Passenger>,
    private readonly driverRepository: DatabaseDriverRepository,
  ) {}

  async findById(id: number): Promise<PassengerM> {
    const driver = await this.passengerEntityRepository.findOneByOrFail({ id });
    return this.toPassenger(driver);
  }

  async findAll(): Promise<PassengerM[]> {
    const drivers = await this.passengerEntityRepository.find();
    return drivers.map(this.toPassenger);
  }

  async requestTrip(id: number, longitude: number, latitude: number): Promise<DriverM[]> {
    return await this.driverRepository.findNearestDrivers(longitude, latitude);
  }

  async insert(driver: PassengerM): Promise<PassengerM> {
    const todoEntity = this.toPassengerEntity(driver);
    const result = await this.passengerEntityRepository.insert(todoEntity);
    return this.toPassenger(result.generatedMaps[0] as Passenger);
  }

  deleteById(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private toPassenger(passengerEntity: Passenger): PassengerM {
    const passenger = new PassengerM();

    passenger.id = passengerEntity.id;
    passenger.name = passengerEntity.name;
    passenger.email = passengerEntity.email;
    passenger.createdDate = passengerEntity.created_date;
    passenger.updatedDate = passengerEntity.updated_date;

    return passenger;
  }

  private toPassengerEntity(passenger: PassengerM): Passenger {
    const passengerEntity = new Passenger();

    passengerEntity.id = passenger.id;
    passengerEntity.name = passenger.name;
    passengerEntity.email = passenger.email;

    return passengerEntity;
  }
}
