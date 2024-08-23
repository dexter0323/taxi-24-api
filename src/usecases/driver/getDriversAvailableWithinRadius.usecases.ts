import { ILogger } from 'src/domain/logger/logger.interface';
import { DriverM } from 'src/domain/model/driver';
import { DriverRepository } from 'src/domain/repositories/driverRepository.interface';

export class GetDriversAvailableWithinRadiusUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly driverRepository: DriverRepository,
  ) {}

  async execute(latitude: number, longitud: number, radius: number): Promise<DriverM[]> {
    return await this.driverRepository.findAllAvailableWithinRadius(latitude, longitud, radius);
  }
}
