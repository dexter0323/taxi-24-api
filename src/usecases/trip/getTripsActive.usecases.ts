import { ILogger } from 'src/domain/logger/logger.interface';
import { TripM } from 'src/domain/model/trip';
import { TripRepository } from 'src/domain/repositories/tripRepository.interface';

export class GetTripsActiveUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly tripRepository: TripRepository,
  ) {}

  async execute(): Promise<TripM[]> {
    return await this.tripRepository.findAllActive();
  }
}
