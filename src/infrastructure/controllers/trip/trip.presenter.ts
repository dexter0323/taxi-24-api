import { ApiProperty } from '@nestjs/swagger';
import { TripM } from 'src/domain/model/trip';

export class TripPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  startLatitude: number;
  @ApiProperty()
  startLongitude: number;
  @ApiProperty()
  endLatitude: number;
  @ApiProperty()
  endLongitude: number;
  @ApiProperty()
  startTime: Date;
  @ApiProperty()
  endTime: Date;
  @ApiProperty()
  createdDate: Date;
  @ApiProperty()
  updatedDate: Date;

  constructor(trip: TripM) {
    this.id = trip.id;
    this.startLatitude = trip.startLatitude;
    this.startLongitude = trip.startLongitude;
    this.endLatitude = trip.endLatitude;
    this.endLongitude = trip.endLongitude;
    this.startTime = trip.startTime;
    this.endTime = trip.endTime;
    this.createdDate = trip.createdDate;
    this.updatedDate = trip.updatedDate;
  }
}
