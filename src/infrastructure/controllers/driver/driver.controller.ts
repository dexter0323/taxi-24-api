import { Controller, Get, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiResponseType } from 'src/infrastructure/common/swagger/response.decorator';
import { DriverPresenter } from 'src/infrastructure/controllers/driver/driver.presenter';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { GetDriversAvailableUseCases } from 'src/usecases/driver/getDriversAvailable.usecases';
import { GetDriversAvailableWithin3kmUseCases } from 'src/usecases/driver/getDriversAvailableWithin3km.usecases';
import { GetDriverUseCases } from 'src/usecases/driver/getDriver.usecases';
import { GetDriversUseCases } from 'src/usecases/driver/getDrivers.usecases';

@Controller('driver')
@ApiTags('driver')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DriverPresenter)
export class DriverController {
  constructor(
    @Inject(UsecasesProxyModule.GET_DRIVER_USECASES_PROXY)
    private readonly getDriverUsecaseProxy: UseCaseProxy<GetDriverUseCases>,
    @Inject(UsecasesProxyModule.GET_DRIVERS_USECASES_PROXY)
    private readonly getDriversUsecaseProxy: UseCaseProxy<GetDriversUseCases>,

    @Inject(UsecasesProxyModule.GET_DRIVERS_AVAILABLE_USECASES_PROXY)
    private readonly getDriversAvailableUsecaseProxy: UseCaseProxy<GetDriversAvailableUseCases>,
    @Inject(UsecasesProxyModule.GET_DRIVERS_AVAILABLE_WITHIN_3KM_USECASES_PROXY)
    private readonly getDriversAvailableWithin3kmUsecaseProxy: UseCaseProxy<GetDriversAvailableWithin3kmUseCases>,
  ) {}

  @Get('driver')
  @ApiResponseType(DriverPresenter, false)
  async getDriver(@Query('id', ParseIntPipe) id: number) {
    const driver = await this.getDriverUsecaseProxy.getInstance().execute(id);
    return new DriverPresenter(driver);
  }

  @Get('drivers')
  @ApiResponseType(DriverPresenter, true)
  async getDrivers() {
    const drivers = await this.getDriversUsecaseProxy.getInstance().execute();
    return drivers.map(driver => new DriverPresenter(driver));
  }

  @Get('drivers-available')
  @ApiResponseType(DriverPresenter, true)
  async getDriversAvailable() {
    const drivers = await this.getDriversAvailableUsecaseProxy.getInstance().execute();
    return drivers.map(driver => new DriverPresenter(driver));
  }

  @Get('drivers-available-3km')
  @ApiResponseType(DriverPresenter, true)
  async getDriversAvailableWithin3km() {
    const drivers = await this.getDriversAvailableWithin3kmUsecaseProxy.getInstance().execute();
    return drivers.map(driver => new DriverPresenter(driver));
  }
}
