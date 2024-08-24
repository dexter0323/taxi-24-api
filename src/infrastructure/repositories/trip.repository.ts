import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TripM } from 'src/domain/model/trip';
import { TripRepository } from 'src/domain/repositories/tripRepository.interface';
import { Trip } from 'src/infrastructure/entities/trip.entity';
import { DatabaseDriverRepository } from 'src/infrastructure/repositories/driver.repository';

@Injectable()
export class DatabaseTripRepository implements TripRepository {
  constructor(
    @InjectRepository(Trip)
    private readonly tripEntityRepository: Repository<Trip>,
    private readonly driverRepository: DatabaseDriverRepository,
  ) {}

  async findAllActive(): Promise<TripM[]> {
    const trips = await this.tripEntityRepository.find();
    return trips.map(this.toTrip);
  }

  async create(passengerId: number, startLatitude: number, startLongitude: number): Promise<TripM> {
    const [driver] = await this.driverRepository.findNearestDrivers(startLatitude, startLongitude);
    const result = await this.tripEntityRepository.save({
      start_latitude: startLatitude,
      start_longitude: startLongitude,
      passenger: { id: passengerId },
      driver: { id: driver.id },
    });
    // const [{ id }] = result.identifiers;
    // const trip = await this.tripEntityRepository.findOneBy({ id });
    return this.toTrip(result);
  }

  async complete(id: number, endLatitude: number, endLongitude: number): Promise<TripM> {
    const trip = await this.tripEntityRepository.findOneBy({ id });
    if (trip) {
      trip.end_latitude = endLatitude;
      trip.end_longitude = endLongitude;
      trip.end_time = new Date();

      const updatedTrip = await this.tripEntityRepository.save(trip);
      return this.toTrip(updatedTrip);
    } else {
      throw new Error('Trip not found');
    }
  }

  private toTrip(tripEntity: Trip & { distance?: string }): TripM {
    const trip = new TripM();

    trip.id = tripEntity.id;
    trip.startLatitude = tripEntity.start_latitude;
    trip.startLongitude = tripEntity.start_longitude;
    trip.endLatitude = tripEntity.end_latitude;
    trip.endLongitude = tripEntity.end_longitude;
    trip.startTime = tripEntity.start_time;
    trip.endTime = tripEntity.end_time;
    trip.createdDate = tripEntity.created_date;
    trip.updatedDate = tripEntity.updated_date;

    return { ...trip, ...(tripEntity.distance ? { distance: tripEntity.distance } : {}) };
  }

  private toTripEntity(trip: TripM): Trip {
    const tripEntity = new Trip();

    tripEntity.id = tripEntity.id;
    tripEntity.start_latitude = trip.startLatitude;
    tripEntity.start_longitude = trip.startLongitude;
    tripEntity.end_latitude = trip.endLatitude;
    tripEntity.end_longitude = trip.endLongitude;
    tripEntity.start_time = trip.startTime;
    tripEntity.end_time = trip.endTime;
    tripEntity.created_date = trip.createdDate;
    tripEntity.updated_date = trip.updatedDate;

    return tripEntity;
  }
}
