import { Module } from '@nestjs/common';

import { AuthController } from './auth/auth.controller';
import { TodoController } from './todo/todo.controller';

import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [TodoController, AuthController],
})
export class ControllersModule {}
