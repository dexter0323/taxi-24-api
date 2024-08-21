import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/infrastructure/common/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from 'src/infrastructure/common/strategies/jwtRefresh.strategy';
import { LocalStrategy } from 'src/infrastructure/common/strategies/local.strategy';
import { EnvironmentConfigModule } from 'src/infrastructure/config/environment-config/environment-config.module';
import { ControllersModule } from 'src/infrastructure/controllers/controllers.module';
import { ExceptionsModule } from 'src/infrastructure/exceptions/exceptions.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { BcryptModule } from 'src/infrastructure/services/bcrypt/bcrypt.module';
import { JwtModule as JwtServiceModule } from 'src/infrastructure/services/jwt/jwt.module';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({ secret: process.env.secret }),
    LoggerModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    ControllersModule,
    BcryptModule,
    JwtServiceModule,
    EnvironmentConfigModule,
  ],
  providers: [LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
})
export class AppModule {}
