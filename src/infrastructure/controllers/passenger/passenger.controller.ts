import { Body, Controller, Get, Inject, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBody, ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiResponseType } from 'src/infrastructure/common/swagger/response.decorator';
import { DriverPresenter } from 'src/infrastructure/controllers/driver/driver.presenter';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { GetDriversAvailableUseCases } from 'src/usecases/driver/getDriversAvailable.usecases';
import { GetDriversAvailableWithinRadiusUseCases as GetDriversAvailableWithinRadiusUseCases } from 'src/usecases/driver/getDriversAvailableWithinRadius.usecases';
import { GetDriverUseCases } from 'src/usecases/driver/getDriver.usecases';
import { GetDriversUseCases } from 'src/usecases/driver/getDrivers.usecases';
import { DriverWithinRadiusDto } from 'src/infrastructure/controllers/driver/driver-dto.class';
import { GetPassengerUseCases } from 'src/usecases/passenger/getPassenger.usecases';
import { GetPassengersUseCases } from 'src/usecases/passenger/getPassengers.usecases';
import { PassengerRequestTripUseCases } from 'src/usecases/passenger/passengerRequestTrip.usecases';
import { PassengerPresenter } from 'src/infrastructure/controllers/passenger/passenger.presenter';
import { RequestTripDto as PassengerRequestTripDto } from 'src/infrastructure/controllers/passenger/passenger-dto.class';

@Controller('passenger')
@ApiTags('passenger')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(PassengerPresenter)
export class PassengerController {
  constructor(
    @Inject(UsecasesProxyModule.GET_PASSENGER_USECASES_PROXY)
    private readonly getPassengerUsecaseProxy: UseCaseProxy<GetPassengerUseCases>,
    @Inject(UsecasesProxyModule.GET_PASSENGERS_USECASES_PROXY)
    private readonly getPassengersUsecaseProxy: UseCaseProxy<GetPassengersUseCases>,
    @Inject(UsecasesProxyModule.PASSENGER_REQUEST_TRIP_USECASES_PROXY)
    private readonly passengerRequestTripUseCaseUsecaseProxy: UseCaseProxy<PassengerRequestTripUseCases>,
  ) {}

  @Get(':id')
  @ApiResponseType(PassengerPresenter, false)
  async getDriver(@Param('id', ParseIntPipe) id: number) {
    const passenger = await this.getPassengerUsecaseProxy.getInstance().execute(id);
    return new PassengerPresenter(passenger);
  }

  @Get()
  @ApiResponseType(PassengerPresenter, true)
  async getDrivers() {
    const passengers = await this.getPassengersUsecaseProxy.getInstance().execute();
    return passengers.map(passenger => new PassengerPresenter(passenger));
  }

  @Get(':id/request-trip')
  @ApiResponseType(DriverPresenter, true)
  async passengerRequestTrip(
    @Param('id', ParseIntPipe) id: number,
    @Query() passengerRequestTripDto: PassengerRequestTripDto,
  ) {
    const longitude = parseFloat(passengerRequestTripDto.longitude);
    const latitude = parseFloat(passengerRequestTripDto.latitude);

    const drivers = await this.passengerRequestTripUseCaseUsecaseProxy
      .getInstance()
      .execute(id, longitude, latitude);

    return drivers.map(driver => new DriverPresenter(driver));
  }
}
