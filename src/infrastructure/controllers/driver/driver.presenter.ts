import { ApiProperty } from '@nestjs/swagger';
import { DriverM } from 'src/domain/model/driver';

export class DriverPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  status: string;
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;
  @ApiProperty()
  distance?: string;
  @ApiProperty()
  createdDate: Date;
  @ApiProperty()
  updatedDate: Date;

  constructor(driver: DriverM) {
    this.id = driver.id;
    this.status = driver.status;
    this.latitude = driver.latitude;
    this.longitude = driver.longitude;
    this.distance = driver.distance;
    this.createdDate = driver.createdDate;
    this.updatedDate = driver.updatedDate;
  }
}
