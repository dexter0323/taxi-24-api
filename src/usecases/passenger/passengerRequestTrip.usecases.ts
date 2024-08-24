import { ILogger } from 'src/domain/logger/logger.interface';
import { DriverM } from 'src/domain/model/driver';
import { PassengerRepository } from 'src/domain/repositories/passengerRepository.interface';

export class PassengerRequestTripUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly passengerRepository: PassengerRepository,
  ) {}

  async execute(id: number, longitud: number, latitude: number): Promise<DriverM[]> {
    return await this.passengerRepository.requestTrip(id, longitud, latitude);
  }
}
