import { Body, Controller, Get, Inject, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBody, ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiResponseType } from 'src/infrastructure/common/swagger/response.decorator';
import { DriverPresenter } from 'src/infrastructure/controllers/driver/driver.presenter';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { GetDriversAvailableUseCases } from 'src/usecases/driver/getDriversAvailable.usecases';
import { GetDriversAvailableWithinRadiusUseCases } from 'src/usecases/driver/getDriversAvailableWithinRadius.usecases';
import { GetDriverUseCases } from 'src/usecases/driver/getDriver.usecases';
import { GetDriversUseCases } from 'src/usecases/driver/getDrivers.usecases';
import { DriverDto } from 'src/infrastructure/controllers/driver/driver-dto.class';

@Controller('driver')
@ApiTags('Driver')
@ApiResponse({ status: 500, description: 'Internal error' })
// @ApiResponse({ status: 200, description: 'Successful response', type: DriverDto })
@ApiExtraModels(DriverPresenter)
export class DriverController {
  constructor(
    @Inject(UsecasesProxyModule.GET_DRIVER_USECASES_PROXY)
    private readonly getDriverUsecaseProxy: UseCaseProxy<GetDriverUseCases>,
    @Inject(UsecasesProxyModule.GET_DRIVERS_USECASES_PROXY)
    private readonly getDriversUsecaseProxy: UseCaseProxy<GetDriversUseCases>,
    @Inject(UsecasesProxyModule.GET_DRIVERS_AVAILABLE_USECASES_PROXY)
    private readonly getDriversAvailableUsecaseProxy: UseCaseProxy<GetDriversAvailableUseCases>,
    @Inject(UsecasesProxyModule.GET_DRIVERS_AVAILABLE_WITHIN_RADIUS_USECASES_PROXY)
    private readonly getDriversAvailableWithinRadiusUsecaseProxy: UseCaseProxy<GetDriversAvailableWithinRadiusUseCases>,
  ) {}

  @Get()
  @ApiResponseType(DriverPresenter, true)
  async getDrivers() {
    const drivers = await this.getDriversUsecaseProxy.getInstance().execute();
    return drivers.map(driver => new DriverPresenter(driver));
  }

  @Get('available')
  @ApiResponseType(DriverPresenter, true)
  async getDriversAvailable() {
    const drivers = await this.getDriversAvailableUsecaseProxy.getInstance().execute();
    return drivers.map(driver => new DriverPresenter(driver));
  }

  @Get('available-within-radius')
  @ApiResponseType(DriverPresenter, true)
  async getDriversAvailableWithinRadius(@Query() driverWithinRadiusDto: DriverDto) {
    const latitude = parseFloat(driverWithinRadiusDto.latitude);
    const longitude = parseFloat(driverWithinRadiusDto.longitude);
    const radius = parseFloat(driverWithinRadiusDto.radius);

    const drivers = await this.getDriversAvailableWithinRadiusUsecaseProxy
      .getInstance()
      .execute(latitude, longitude, radius);

    return drivers.map(driver => new DriverPresenter(driver));
  }

  @Get(':id')
  @ApiResponseType(DriverPresenter, false)
  async getDriver(@Param('id', ParseIntPipe) id: number) {
    const driver = await this.getDriverUsecaseProxy.getInstance().execute(id);
    return new DriverPresenter(driver);
  }
}
