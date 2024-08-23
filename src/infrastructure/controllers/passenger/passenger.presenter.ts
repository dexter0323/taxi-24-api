import { ApiProperty } from '@nestjs/swagger';
import { PassengerM } from 'src/domain/model/passenger';

export class PassengerPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  createdDate: Date;
  @ApiProperty()
  updatedDate: Date;

  constructor(passenger: PassengerM) {
    this.id = passenger.id;
    this.name = passenger.name;
    this.email = passenger.email;
    this.createdDate = passenger.createdDate;
    this.updatedDate = passenger.updatedDate;
  }
}
