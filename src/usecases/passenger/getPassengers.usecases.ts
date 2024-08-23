import { ILogger } from 'src/domain/logger/logger.interface';
import { PassengerM } from 'src/domain/model/passenger';
import { PassengerRepository } from 'src/domain/repositories/passengerRepository.interface';

export class GetPassengersUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly passengerRepository: PassengerRepository,
  ) {}

  async execute(): Promise<PassengerM[]> {
    return await this.passengerRepository.findAll();
  }
}
