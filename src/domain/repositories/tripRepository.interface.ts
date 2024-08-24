import { TripM } from 'src/domain/model/trip';

export interface TripRepository {
  findAllActive(): Promise<TripM[]>;
  create(passengerId: number, startLatitude: number, startLongitude: number): Promise<TripM>;
  complete(id: number, endLatitude: number, endLongitude: number): Promise<TripM>;
}
