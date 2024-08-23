import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DriverM, DriverStatus } from 'src/domain/model/driver';
import { DriverRepository } from 'src/domain/repositories/driverRepository.interface';
import { Driver } from 'src/infrastructure/entities/driver.entity';

@Injectable()
export class DatabaseDriverRepository implements DriverRepository {
  constructor(
    @InjectRepository(Driver)
    private readonly driverEntityRepository: Repository<Driver>,
  ) {}

  async findById(id: number): Promise<DriverM> {
    const driver = await this.driverEntityRepository.findOneByOrFail({ id });
    return this.toDriver(driver);
  }

  async findAll(): Promise<DriverM[]> {
    const drivers = await this.driverEntityRepository.find();
    return drivers.map(this.toDriver);
  }

  async findAllAvailable(): Promise<DriverM[]> {
    const drivers = await this.driverEntityRepository.find({
      where: { status: DriverStatus.AVAILABLE },
    });
    return drivers.map(this.toDriver);
  }

  async findAllAvailableWithinRadius(
    longitude: number,
    latitude: number,
    radius: number,
  ): Promise<DriverM[]> {
    /** SRID for the WGS 84 coordinate system, used for GPS coordinates */
    const SRID_WGS84 = 4326;

    const drivers = await this.driverEntityRepository
      .createQueryBuilder('driver')
      .select([
        'driver.id AS id',
        'driver.status AS status',
        'driver.longitude AS longitude',
        'driver.latitude AS latitude',
        'driver.createdate AS created_date',
        'driver.updateddate AS updated_date',
        `TO_CHAR(
        ST_Distance(
          geography(ST_SetSRID(ST_MakePoint(driver.longitude, driver.latitude), ${SRID_WGS84})),
          geography(ST_SetSRID(ST_MakePoint(:longitude, :latitude), ${SRID_WGS84}))
        ) / 1000, 'FM999999990.00'
      ) || ' km' AS distance`,
      ])
      .where('driver.status = :status', { status: DriverStatus.AVAILABLE })
      .andWhere(
        `ST_Distance(
        geography(ST_SetSRID(ST_MakePoint(driver.longitude, driver.latitude), ${SRID_WGS84})),
        geography(ST_SetSRID(ST_MakePoint(:longitude, :latitude), ${SRID_WGS84}))
      ) <= :radius * 1000`,
        { longitude, latitude, radius },
      )
      .orderBy('distance', 'ASC')
      .setParameters({ longitude, latitude })
      .getRawMany();

    return drivers.map(this.toDriver);
  }

  async insert(driver: DriverM): Promise<DriverM> {
    const todoEntity = this.toDriverEntity(driver);
    const result = await this.driverEntityRepository.insert(todoEntity);
    return this.toDriver(result.generatedMaps[0] as Driver);
  }

  deleteById(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private toDriver(driverEntity: Driver & { distance?: string }): DriverM {
    const driver: DriverM = new DriverM();

    driver.id = driverEntity.id;
    driver.status = driverEntity.status;
    driver.longitude = driverEntity.longitude;
    driver.latitude = driverEntity.latitude;
    driver.createdDate = driverEntity.created_date;
    driver.updatedDate = driverEntity.updated_date;

    return { ...driver, ...(driverEntity.distance ? { distance: driverEntity.distance } : {}) };
  }

  private toDriverEntity(driverEntity: DriverM): Driver {
    const driver: Driver = new Driver();

    driver.id = driverEntity.id;
    driver.status = driverEntity.status;
    driver.longitude = driverEntity.longitude;
    driver.latitude = driverEntity.latitude;

    return driver;
  }
}
