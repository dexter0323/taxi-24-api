import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiResponseType } from 'src/infrastructure/common/swagger/response.decorator';
import { PassengerPresenter } from 'src/infrastructure/controllers/passenger/passenger.presenter';
import { CompleteTripDto, CreateTripDto } from 'src/infrastructure/controllers/trip/trip-dto.class';
import { TripPresenter } from 'src/infrastructure/controllers/trip/trip.presenter';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { CompleteTripUseCases } from 'src/usecases/trip/completeTrip.usecases';
import { CreateTripUseCases } from 'src/usecases/trip/createTrip.usecases';
import { GetTripsActiveUseCases } from 'src/usecases/trip/getTripsActive.usecases';

@Controller('trip')
@ApiTags('Trip')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(TripPresenter)
export class TripController {
  constructor(
    @Inject(UsecasesProxyModule.GET_TRIPS_ACTIVE_USECASES_PROXY)
    private readonly getTripsActiveUsecaseProxy: UseCaseProxy<GetTripsActiveUseCases>,
    @Inject(UsecasesProxyModule.CREATE_TRIP_USECASES_PROXY)
    private readonly createTripUsecaseProxy: UseCaseProxy<CreateTripUseCases>,
    @Inject(UsecasesProxyModule.COMPLETE_TRIP_USECASES_PROXY)
    private readonly completeTripUsecaseProxy: UseCaseProxy<CompleteTripUseCases>,
  ) {}

  @Post('create')
  @ApiResponseType(TripPresenter, true)
  async createTripe(@Body() createTripDto: CreateTripDto) {
    const trip = await this.createTripUsecaseProxy
      .getInstance()
      .execute(createTripDto.passengerId, createTripDto.latitud, createTripDto.longitude);
    return new TripPresenter(trip);
  }

  @Post(':id/complete')
  @ApiResponseType(TripPresenter, true)
  async completeTrip(
    @Param('id', ParseIntPipe) id: number,
    @Body() completeTripDto: CompleteTripDto,
  ) {
    const trip = await this.completeTripUsecaseProxy
      .getInstance()
      .execute(id, completeTripDto.latitud, completeTripDto.longitude);
    return new TripPresenter(trip);
  }

  @Get()
  @ApiResponseType(TripPresenter, true)
  async getTripsActive() {
    const trips = await this.getTripsActiveUsecaseProxy.getInstance().execute();
    return trips.map(trip => new TripPresenter(trip));
  }
}
