import { Module } from '@nestjs/common';

import { AuthController } from './auth/auth.controller';
import { TodoController } from './todo/todo.controller';

import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { DriverController } from 'src/infrastructure/controllers/driver/driver.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [TodoController, AuthController, DriverController],
})
export class ControllersModule {}
