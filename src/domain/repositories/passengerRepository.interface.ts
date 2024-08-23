import { DriverM } from 'src/domain/model/driver';
import { PassengerM } from 'src/domain/model/passenger';

export interface PassengerRepository {
  findById(id: number): Promise<PassengerM>;
  findAll(): Promise<PassengerM[]>;
  requestTrip(id: number, longitude: number, latitude: number): Promise<DriverM[]>;
  insert(driver: PassengerM): Promise<PassengerM>;
  deleteById(id: number): Promise<void>;
}
