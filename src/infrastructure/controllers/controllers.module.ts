import { Module } from '@nestjs/common';

import { AuthController } from './auth/auth.controller';

import { DriverController } from 'src/infrastructure/controllers/driver/driver.controller';
import { PassengerController } from 'src/infrastructure/controllers/passenger/passenger.controller';
import { TripController } from 'src/infrastructure/controllers/trip/trip.controller';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [AuthController, DriverController, PassengerController, TripController],
})
export class ControllersModule {}
