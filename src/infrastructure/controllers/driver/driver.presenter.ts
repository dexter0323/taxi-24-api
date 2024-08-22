import { ApiProperty } from '@nestjs/swagger';
import { DriverM } from 'src/domain/model/driver';

export class DriverPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  status: string;
  @ApiProperty()
  location: string;
  @ApiProperty()
  createdate: Date;
  @ApiProperty()
  updateddate: Date;

  constructor(driver: DriverM) {
    this.id = driver.id;
    this.status = driver.status;
    this.location = driver.location;
    this.createdate = driver.createdDate;
    this.updateddate = driver.updatedDate;
  }
}
