import { TripM } from 'src/domain/model/trip';

export interface TripRepository {
  findAllActive(): Promise<TripM[]>;
}
