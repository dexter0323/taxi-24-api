import { ILogger } from 'src/domain/logger/logger.interface';
import { DriverM } from 'src/domain/model/driver';
import { DriverRepository } from 'src/domain/repositories/driverRepository.interface';

export class GetDriversAvailableWithin3kmUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly driverRepository: DriverRepository,
  ) {}

  async execute(): Promise<DriverM[]> {
    return await this.driverRepository.findAllAvailableWithin3km();
  }
}
