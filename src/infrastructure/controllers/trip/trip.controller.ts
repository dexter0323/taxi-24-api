import { Controller, Get, Inject, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiResponseType } from 'src/infrastructure/common/swagger/response.decorator';
import { DriverPresenter } from 'src/infrastructure/controllers/driver/driver.presenter';
import { RequestTripDto as PassengerRequestTripDto } from 'src/infrastructure/controllers/passenger/passenger-dto.class';
import { PassengerPresenter } from 'src/infrastructure/controllers/passenger/passenger.presenter';
import { TripPresenter } from 'src/infrastructure/controllers/trip/trip.presenter';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { GetPassengerUseCases } from 'src/usecases/passenger/getPassenger.usecases';
import { GetPassengersUseCases } from 'src/usecases/passenger/getPassengers.usecases';
import { PassengerRequestTripUseCases } from 'src/usecases/passenger/passengerRequestTrip.usecases';
import { GetTripsActiveUseCases } from 'src/usecases/trip/getTripsActive.usecases';

@Controller('trip')
@ApiTags('Trip')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(TripPresenter)
export class TripController {
  constructor(
    @Inject(UsecasesProxyModule.GET_TRIPS_ACTIVE_USECASES_PROXY)
    private readonly getTripsActiveUsecaseProxy: UseCaseProxy<GetTripsActiveUseCases>,
  ) {}

  @Get()
  @ApiResponseType(PassengerPresenter, true)
  async getTripsActive() {
    const trips = await this.getTripsActiveUsecaseProxy.getInstance().execute();
    return trips.map(trip => new TripPresenter(trip));
  }
}
