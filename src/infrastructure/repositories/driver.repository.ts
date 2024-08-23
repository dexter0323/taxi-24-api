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
    const drivers = await this.driverEntityRepository
      .createQueryBuilder('driver')
      .where('driver.status = :status', { status: DriverStatus.AVAILABLE })
      .andWhere(
        `ST_Distance(
        geography(ST_SetSRID(ST_MakePoint(driver.longitude, driver.latitude), 4326)),
        geography(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326))
      ) <= :radius * 1000`,
        { longitude, latitude, radius },
      )
      .getMany();
    return drivers.map(this.toDriver);
  }

  async insert(driver: DriverM): Promise<DriverM> {
    const todoEntity = this.toDriverEntity(driver);
    const result = await this.driverEntityRepository.insert(todoEntity);
    console.log(result.generatedMaps);
    return this.toDriver(result.generatedMaps[0] as Driver);
  }

  deleteById(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private toDriver(driverEntity: Driver): DriverM {
    const driver: DriverM = new DriverM();

    driver.id = driverEntity.id;
    driver.status = driverEntity.status;
    driver.longitude = driverEntity.longitude;
    driver.latitude = driverEntity.latitude;
    driver.createdDate = driverEntity.created_date;
    driver.updatedDate = driverEntity.updated_date;

    return driver;
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
