import { ILogger } from 'src/domain/logger/logger.interface';
import { TripM } from 'src/domain/model/trip';
import { TripRepository } from 'src/domain/repositories/tripRepository.interface';

export class CreateTripUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly tripRepository: TripRepository,
  ) {}

  async execute(
    passengerId: number,
    startLatitude: number,
    startLongitude: number,
  ): Promise<TripM> {
    return await this.tripRepository.create(passengerId, startLatitude, startLongitude);
  }
}
