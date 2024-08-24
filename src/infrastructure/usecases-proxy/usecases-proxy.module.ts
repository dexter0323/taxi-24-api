import { DynamicModule, Module } from '@nestjs/common';

import { EnvironmentConfigModule } from 'src/infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { ExceptionsModule } from 'src/infrastructure/exceptions/exceptions.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { DatabaseDriverRepository } from 'src/infrastructure/repositories/driver.repository';
import { DatabasePassengerRepository } from 'src/infrastructure/repositories/passenger.repository';
import { RepositoriesModule } from 'src/infrastructure/repositories/repositories.module';
import { DatabaseTripRepository } from 'src/infrastructure/repositories/trip.repository';
import { DatabaseUserRepository } from 'src/infrastructure/repositories/user.repository';
import { BcryptModule } from 'src/infrastructure/services/bcrypt/bcrypt.module';
import { BcryptService } from 'src/infrastructure/services/bcrypt/bcrypt.service';
import { JwtModule } from 'src/infrastructure/services/jwt/jwt.module';
import { JwtTokenService } from 'src/infrastructure/services/jwt/jwt.service';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { IsAuthenticatedUseCases } from 'src/usecases/auth/isAuthenticated.usecases';
import { LoginUseCases } from 'src/usecases/auth/login.usecases';
import { LogoutUseCases } from 'src/usecases/auth/logout.usecases';
import { SignUpUseCases } from 'src/usecases/auth/signup.usecases';
import { GetDriverUseCases } from 'src/usecases/driver/getDriver.usecases';
import { GetDriversUseCases } from 'src/usecases/driver/getDrivers.usecases';
import { GetDriversAvailableUseCases } from 'src/usecases/driver/getDriversAvailable.usecases';
import { GetDriversAvailableWithinRadiusUseCases } from 'src/usecases/driver/getDriversAvailableWithinRadius.usecases';
import { GetPassengerUseCases } from 'src/usecases/passenger/getPassenger.usecases';
import { GetPassengersUseCases } from 'src/usecases/passenger/getPassengers.usecases';
import { PassengerRequestTripUseCases } from 'src/usecases/passenger/passengerRequestTrip.usecases';
import { CompleteTripUseCases } from 'src/usecases/trip/completeTrip.usecases';
import { CreateTripUseCases } from 'src/usecases/trip/createTrip.usecases';
import { GetTripsActiveUseCases } from 'src/usecases/trip/getTripsActive.usecases';

@Module({
  imports: [
    LoggerModule,
    JwtModule,
    BcryptModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
  ],
})
export class UsecasesProxyModule {
  // Auth
  static SIGNUP_USECASES_PROXY = 'SignUpUseCasesProxy';
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  static IS_AUTHENTICATED_USECASES_PROXY = 'IsAuthenticatedUseCasesProxy';
  static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';

  // Driver
  /** Obtener un conductor específico por ID */
  static GET_DRIVER_USECASES_PROXY = 'getDriverUsecasesProxy';
  /** Obtenga una lista de todos los conductores */
  static GET_DRIVERS_USECASES_PROXY = 'getDriversUsecasesProxy';
  /** Obtenga una lista de todos los conductores disponibles */
  static GET_DRIVERS_AVAILABLE_USECASES_PROXY = 'getDriversAvailableUsecasesProxy';
  /** Obtenga una lista de todos los conductores disponibles en un radio de 3km para la ubicación especificada.
   * 3km por defecto si no se le pasa el parametro de radio
   */
  static GET_DRIVERS_AVAILABLE_WITHIN_RADIUS_USECASES_PROXY =
    'getDriversAvailableWithinRadiusUsecasesProxy';

  // Passenger
  /** Obtener un pasajero específico por ID */
  static GET_PASSENGER_USECASES_PROXY = 'getPassengerUsecasesProxy';
  /** Obtenga una lista de todos los pasajeros */
  static GET_PASSENGERS_USECASES_PROXY = 'getPassengersUsecasesProxy';
  /** Para un pasajero solicitando un viaje, obtenga una lista de los 3 conductores más cercanos al punto de partida */
  static PASSENGER_REQUEST_TRIP_USECASES_PROXY = 'passengerRequestTripUsecasesProxy';

  // Trip
  /** Obtener un pasajero específico por ID */
  static GET_TRIPS_ACTIVE_USECASES_PROXY = 'getTripsActiveUsecasesProxy';
  /** Crear una nueva solicitud de "Viaje" asignando un conductor a un pasajero */
  static CREATE_TRIP_USECASES_PROXY = 'createTripUsecasesProxy';
  /** Completar un viaje */
  static COMPLETE_TRIP_USECASES_PROXY = 'completeTripUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [LoggerService, DatabaseUserRepository],
          provide: UsecasesProxyModule.SIGNUP_USECASES_PROXY,
          useFactory: (logger: LoggerService, userRepo: DatabaseUserRepository) =>
            new UseCaseProxy(new SignUpUseCases(logger, userRepo)),
        },
        {
          inject: [
            LoggerService,
            JwtTokenService,
            EnvironmentConfigService,
            DatabaseUserRepository,
            BcryptService,
          ],
          provide: UsecasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            userRepo: DatabaseUserRepository,
            bcryptService: BcryptService,
          ) =>
            new UseCaseProxy(
              new LoginUseCases(logger, jwtTokenService, config, userRepo, bcryptService),
            ),
        },
        {
          inject: [DatabaseUserRepository],
          provide: UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
          useFactory: (userRepo: DatabaseUserRepository) =>
            new UseCaseProxy(new IsAuthenticatedUseCases(userRepo)),
        },
        {
          inject: [],
          provide: UsecasesProxyModule.LOGOUT_USECASES_PROXY,
          useFactory: () => new UseCaseProxy(new LogoutUseCases()),
        },

        {
          inject: [LoggerService, DatabaseDriverRepository],
          provide: UsecasesProxyModule.GET_DRIVER_USECASES_PROXY,
          useFactory: (logger: LoggerService, driverRepository: DatabaseDriverRepository) =>
            new UseCaseProxy(new GetDriverUseCases(logger, driverRepository)),
        },
        {
          inject: [LoggerService, DatabaseDriverRepository],
          provide: UsecasesProxyModule.GET_DRIVERS_USECASES_PROXY,
          useFactory: (logger: LoggerService, driverRepository: DatabaseDriverRepository) =>
            new UseCaseProxy(new GetDriversUseCases(logger, driverRepository)),
        },
        {
          inject: [LoggerService, DatabaseDriverRepository],
          provide: UsecasesProxyModule.GET_DRIVERS_AVAILABLE_USECASES_PROXY,
          useFactory: (logger: LoggerService, driverRepository: DatabaseDriverRepository) =>
            new UseCaseProxy(new GetDriversAvailableUseCases(logger, driverRepository)),
        },
        {
          inject: [LoggerService, DatabaseDriverRepository],
          provide: UsecasesProxyModule.GET_DRIVERS_AVAILABLE_WITHIN_RADIUS_USECASES_PROXY,
          useFactory: (logger: LoggerService, driverRepository: DatabaseDriverRepository) =>
            new UseCaseProxy(new GetDriversAvailableWithinRadiusUseCases(logger, driverRepository)),
        },

        {
          inject: [LoggerService, DatabasePassengerRepository],
          provide: UsecasesProxyModule.GET_PASSENGER_USECASES_PROXY,
          useFactory: (logger: LoggerService, passengerRepository: DatabasePassengerRepository) =>
            new UseCaseProxy(new GetPassengerUseCases(logger, passengerRepository)),
        },
        {
          inject: [LoggerService, DatabasePassengerRepository],
          provide: UsecasesProxyModule.GET_PASSENGERS_USECASES_PROXY,
          useFactory: (logger: LoggerService, passengerRepository: DatabasePassengerRepository) =>
            new UseCaseProxy(new GetPassengersUseCases(logger, passengerRepository)),
        },
        {
          inject: [LoggerService, DatabasePassengerRepository],
          provide: UsecasesProxyModule.PASSENGER_REQUEST_TRIP_USECASES_PROXY,
          useFactory: (logger: LoggerService, passengerRepository: DatabasePassengerRepository) =>
            new UseCaseProxy(new PassengerRequestTripUseCases(logger, passengerRepository)),
        },

        {
          inject: [LoggerService, DatabaseTripRepository],
          provide: UsecasesProxyModule.GET_TRIPS_ACTIVE_USECASES_PROXY,
          useFactory: (logger: LoggerService, tripRepository: DatabaseTripRepository) =>
            new UseCaseProxy(new GetTripsActiveUseCases(logger, tripRepository)),
        },
        {
          inject: [LoggerService, DatabaseTripRepository],
          provide: UsecasesProxyModule.CREATE_TRIP_USECASES_PROXY,
          useFactory: (logger: LoggerService, tripRepository: DatabaseTripRepository) =>
            new UseCaseProxy(new CreateTripUseCases(logger, tripRepository)),
        },
        {
          inject: [LoggerService, DatabaseTripRepository],
          provide: UsecasesProxyModule.COMPLETE_TRIP_USECASES_PROXY,
          useFactory: (logger: LoggerService, tripRepository: DatabaseTripRepository) =>
            new UseCaseProxy(new CompleteTripUseCases(logger, tripRepository)),
        },
      ],
      exports: [
        UsecasesProxyModule.SIGNUP_USECASES_PROXY,
        UsecasesProxyModule.LOGIN_USECASES_PROXY,
        UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
        UsecasesProxyModule.LOGOUT_USECASES_PROXY,

        UsecasesProxyModule.GET_DRIVER_USECASES_PROXY,
        UsecasesProxyModule.GET_DRIVERS_USECASES_PROXY,
        UsecasesProxyModule.GET_DRIVERS_AVAILABLE_USECASES_PROXY,
        UsecasesProxyModule.GET_DRIVERS_AVAILABLE_WITHIN_RADIUS_USECASES_PROXY,

        UsecasesProxyModule.GET_PASSENGER_USECASES_PROXY,
        UsecasesProxyModule.GET_PASSENGERS_USECASES_PROXY,
        UsecasesProxyModule.PASSENGER_REQUEST_TRIP_USECASES_PROXY,

        UsecasesProxyModule.GET_TRIPS_ACTIVE_USECASES_PROXY,
        UsecasesProxyModule.CREATE_TRIP_USECASES_PROXY,
        UsecasesProxyModule.COMPLETE_TRIP_USECASES_PROXY,
      ],
    };
  }
}
