import { DriverM } from 'src/domain/model/driver';

export interface DriverRepository {
  findById(id: number): Promise<DriverM>;
  findAll(): Promise<DriverM[]>;
  findAllAvailable(): Promise<DriverM[]>;
  findAllAvailableWithinRadius(
    latitude: number,
    longitude: number,
    radius?: number,
  ): Promise<DriverM[]>;
  insert(driver: DriverM): Promise<DriverM>;
}
