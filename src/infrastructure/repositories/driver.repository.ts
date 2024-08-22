import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DriverRepository } from 'src/domain/repositories/driverRepository.interface';
import { DriverM } from 'src/domain/model/driver';
import { Driver } from 'src/infrastructure/entities/driver.entity';

@Injectable()
export class DatabaseDriverRepository implements DriverRepository {
  constructor(
    @InjectRepository(Driver)
    private readonly driverEntityRepository: Repository<Driver>,
  ) {}

  async findById(id: number): Promise<DriverM> {
    const driverEntity = await this.driverEntityRepository.findOneByOrFail({ id });
    return this.toDrive(driverEntity);
  }

  async findAll(): Promise<DriverM[]> {
    const driversEntity = await this.driverEntityRepository.find();
    return driversEntity.map(todoEntity => this.toDrive(todoEntity));
  }

  async findAllAvailable(): Promise<DriverM[]> {
    const driversEntity = await this.driverEntityRepository.find({
      where: { status: 'active' },
    });
    return driversEntity.map(todoEntity => this.toDrive(todoEntity));
  }

  findAllAvailableWithin3km(): Promise<DriverM[]> {
    throw new Error('Method not implemented.');
  }

  async insert(driver: DriverM): Promise<DriverM> {
    const todoEntity = this.toDriveEntity(driver);
    const result = await this.driverEntityRepository.insert(todoEntity);
    console.log(result.generatedMaps);
    return this.toDrive(result.generatedMaps[0] as Driver);
  }

  deleteById(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private toDrive(driverEntity: Driver): DriverM {
    const driver: DriverM = new DriverM();

    driver.id = driverEntity.id;
    driver.status = driverEntity.status;
    driver.location = driverEntity.location;
    driver.createdDate = driverEntity.created_date;
    driver.updatedDate = driverEntity.updated_date;

    return driver;
  }

  private toDriveEntity(driverEntity: DriverM): Driver {
    const driveEntity: Driver = new Driver();
    driveEntity.id = driverEntity.id;
    driveEntity.status = driverEntity.status;
    driveEntity.location = driverEntity.location;

    return driveEntity;
  }
}
