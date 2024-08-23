import { DriverM } from 'src/domain/model/driver';

export interface DriverRepository {
  findAll(): Promise<DriverM[]>;
  findAllAvailable(): Promise<DriverM[]>;
  findAllAvailableWithinRadius(
    longitude: number,
    latitude: number,
    radius?: number,
  ): Promise<DriverM[]>;
  findById(id: number): Promise<DriverM>;
  insert(driver: DriverM): Promise<DriverM>;
  deleteById(id: number): Promise<void>;
}
