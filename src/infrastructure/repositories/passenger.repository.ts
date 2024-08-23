import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PassengerRepository } from 'src/domain/repositories/passengerRepository.interface';
import { PassengerM } from 'src/domain/model/passenger';
import { Passenger } from 'src/infrastructure/entities/passenger.entity';
import { DriverM } from 'src/domain/model/driver';

@Injectable()
export class DatabasePassengerRepository implements PassengerRepository {
  constructor(
    @InjectRepository(Passenger)
    private readonly driverEntityRepository: Repository<Passenger>,
  ) {}

  async findById(id: number): Promise<PassengerM> {
    const driver = await this.driverEntityRepository.findOneByOrFail({ id });
    return this.toDriver(driver);
  }

  async findAll(): Promise<PassengerM[]> {
    const drivers = await this.driverEntityRepository.find();
    return drivers.map(this.toDriver);
  }

  async requestTrip(id: number, longitude: number, latitude: number): Promise<DriverM[]> {
    /** SRID for the WGS 84 coordinate system, used for GPS coordinates */
    const SRID_WGS84 = 4326;

    const drivers = await this.driverEntityRepository
      .createQueryBuilder('passenger')
      .select([
        'driver.id AS id',
        'driver.status AS status',
        'driver.longitude AS longitude',
        'driver.latitude AS latitude',
        'driver.created_date AS created_date',
        'driver.updated_date AS updated_date',
        `TO_CHAR(
        ST_Distance(
          geography(ST_SetSRID(ST_MakePoint(driver.longitude, driver.latitude), ${SRID_WGS84})),
          geography(ST_SetSRID(ST_MakePoint(:longitude, :latitude), ${SRID_WGS84}))
        ) / 1000, 'FM999999990.00'
      ) || ' km' AS distance`,
      ])
      // .where('driver.status = :status', { status: DriverStatus.AVAILABLE })
      .andWhere(
        `ST_Distance(
        geography(ST_SetSRID(ST_MakePoint(driver.longitude, driver.latitude), ${SRID_WGS84})),
        geography(ST_SetSRID(ST_MakePoint(:longitude, :latitude), ${SRID_WGS84}))
      ) <= :radius * 1000`,
        { longitude, latitude },
      )
      .orderBy('distance', 'ASC')
      .setParameters({ longitude, latitude })
      .getRawMany();

    return [] as any;
  }

  async insert(driver: PassengerM): Promise<PassengerM> {
    const todoEntity = this.toDriverEntity(driver);
    const result = await this.driverEntityRepository.insert(todoEntity);
    return this.toDriver(result.generatedMaps[0] as Passenger);
  }

  deleteById(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private toDriver(passengerEntity: Passenger): PassengerM {
    const passenger = new PassengerM();

    passenger.id = passengerEntity.id;
    passenger.name = passengerEntity.name;
    passenger.email = passengerEntity.email;
    passenger.createdDate = passengerEntity.created_date;
    passenger.updatedDate = passengerEntity.updated_date;

    return passenger;
  }

  private toDriverEntity(passenger: PassengerM): Passenger {
    const passengerEntity = new Passenger();

    passengerEntity.id = passenger.id;
    passengerEntity.name = passenger.name;
    passengerEntity.email = passenger.email;

    return passengerEntity;
  }
}
