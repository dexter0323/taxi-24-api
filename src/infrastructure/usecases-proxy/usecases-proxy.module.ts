import { DynamicModule, Module } from '@nestjs/common';

import { EnvironmentConfigModule } from 'src/infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { ExceptionsModule } from 'src/infrastructure/exceptions/exceptions.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { DatabaseDriverRepository } from 'src/infrastructure/repositories/driver.repository';
import { RepositoriesModule } from 'src/infrastructure/repositories/repositories.module';
import { DatabaseTodoRepository } from 'src/infrastructure/repositories/todo.repository';
import { DatabaseUserRepository } from 'src/infrastructure/repositories/user.repository';
import { BcryptModule } from 'src/infrastructure/services/bcrypt/bcrypt.module';
import { BcryptService } from 'src/infrastructure/services/bcrypt/bcrypt.service';
import { JwtModule } from 'src/infrastructure/services/jwt/jwt.module';
import { JwtTokenService } from 'src/infrastructure/services/jwt/jwt.service';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { IsAuthenticatedUseCases } from 'src/usecases/auth/isAuthenticated.usecases';
import { LoginUseCases } from 'src/usecases/auth/login.usecases';
import { LogoutUseCases } from 'src/usecases/auth/logout.usecases';
import { GetDriverUseCases } from 'src/usecases/driver/getDriver.usecases';
import { GetDriversUseCases } from 'src/usecases/driver/getDrivers.usecases';
import { GetDriversAvailableUseCases } from 'src/usecases/driver/getDriversAvailable.usecases';
import { GetDriversAvailableWithin3kmUseCases } from 'src/usecases/driver/getDriversAvailableWithin3km.usecases';
import { addTodoUseCases } from 'src/usecases/todo/addTodo.usecases';
import { deleteTodoUseCases } from 'src/usecases/todo/deleteTodo.usecases';
import { GetTodoUseCases } from 'src/usecases/todo/getTodo.usecases';
import { getTodosUseCases } from 'src/usecases/todo/getTodos.usecases';
import { updateTodoUseCases } from 'src/usecases/todo/updateTodo.usecases';

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
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  static IS_AUTHENTICATED_USECASES_PROXY = 'IsAuthenticatedUseCasesProxy';
  static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';

  // Todo
  static GET_TODO_USECASES_PROXY = 'getTodoUsecasesProxy';
  static GET_TODOS_USECASES_PROXY = 'getTodosUsecasesProxy';
  static POST_TODO_USECASES_PROXY = 'postTodoUsecasesProxy';
  static DELETE_TODO_USECASES_PROXY = 'deleteTodoUsecasesProxy';
  static PUT_TODO_USECASES_PROXY = 'putTodoUsecasesProxy';

  // Driver
  /** Obtener un conductor específico por ID */
  static GET_DRIVER_USECASES_PROXY = 'getDriverUsecasesProxy';
  /** Obtenga una lista de todos los conductores */
  static GET_DRIVERS_USECASES_PROXY = 'getDriversUsecasesProxy';
  /** Obtenga una lista de todos los conductores disponibles */
  static GET_DRIVERS_AVAILABLE_USECASES_PROXY = 'getDriversAvailableUsecasesProxy';
  /** Obtenga una lista de todos los conductores disponibles en un radio de 3 km para la ubicación especificada */
  static GET_DRIVERS_AVAILABLE_WITHIN_3KM_USECASES_PROXY =
    'getDriversAvailableWithin3kmUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
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
          inject: [DatabaseTodoRepository],
          provide: UsecasesProxyModule.GET_TODO_USECASES_PROXY,
          useFactory: (todoRepository: DatabaseTodoRepository) =>
            new UseCaseProxy(new GetTodoUseCases(todoRepository)),
        },
        {
          inject: [DatabaseTodoRepository],
          provide: UsecasesProxyModule.GET_TODOS_USECASES_PROXY,
          useFactory: (todoRepository: DatabaseTodoRepository) =>
            new UseCaseProxy(new getTodosUseCases(todoRepository)),
        },
        {
          inject: [LoggerService, DatabaseTodoRepository],
          provide: UsecasesProxyModule.POST_TODO_USECASES_PROXY,
          useFactory: (logger: LoggerService, todoRepository: DatabaseTodoRepository) =>
            new UseCaseProxy(new addTodoUseCases(logger, todoRepository)),
        },
        {
          inject: [LoggerService, DatabaseTodoRepository],
          provide: UsecasesProxyModule.PUT_TODO_USECASES_PROXY,
          useFactory: (logger: LoggerService, todoRepository: DatabaseTodoRepository) =>
            new UseCaseProxy(new updateTodoUseCases(logger, todoRepository)),
        },
        {
          inject: [LoggerService, DatabaseTodoRepository],
          provide: UsecasesProxyModule.DELETE_TODO_USECASES_PROXY,
          useFactory: (logger: LoggerService, todoRepository: DatabaseTodoRepository) =>
            new UseCaseProxy(new deleteTodoUseCases(logger, todoRepository)),
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
          provide: UsecasesProxyModule.GET_DRIVERS_AVAILABLE_WITHIN_3KM_USECASES_PROXY,
          useFactory: (logger: LoggerService, driverRepository: DatabaseDriverRepository) =>
            new UseCaseProxy(new GetDriversAvailableWithin3kmUseCases(logger, driverRepository)),
        },
      ],
      exports: [
        UsecasesProxyModule.GET_TODO_USECASES_PROXY,
        UsecasesProxyModule.GET_TODOS_USECASES_PROXY,
        UsecasesProxyModule.POST_TODO_USECASES_PROXY,
        UsecasesProxyModule.PUT_TODO_USECASES_PROXY,
        UsecasesProxyModule.DELETE_TODO_USECASES_PROXY,

        UsecasesProxyModule.LOGIN_USECASES_PROXY,
        UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
        UsecasesProxyModule.LOGOUT_USECASES_PROXY,

        UsecasesProxyModule.GET_DRIVER_USECASES_PROXY,
        UsecasesProxyModule.GET_DRIVERS_USECASES_PROXY,
        UsecasesProxyModule.GET_DRIVERS_AVAILABLE_USECASES_PROXY,
        UsecasesProxyModule.GET_DRIVERS_AVAILABLE_WITHIN_3KM_USECASES_PROXY,
      ],
    };
  }
}
