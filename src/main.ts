import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

import { AllExceptionFilter } from 'src/infrastructure/common/filter/exception.filter';
import { LoggingInterceptor } from 'src/infrastructure/common/interceptors/logger.interceptor';
import {
  ResponseFormat,
  ResponseInterceptor,
} from 'src/infrastructure/common/interceptors/response.interceptor';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { Environment } from 'src/infrastructure/config/environment-config/environment-config.validation';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // Filter
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  // Pipes
  app.useGlobalPipes(new ValidationPipe());

  // Interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Base route
  app.setGlobalPrefix('v1');

  // swagger config
  if (process.env.NODE_ENV !== Environment.Production) {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Taxi24 API')
      .setDescription('Example with todo list')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ResponseFormat],
      deepScanRoutes: true,
    });

    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.API_PORT, () =>
    Logger.log(`taxi-24-api listenning on port: ${process.env.API_PORT}`),
  );
})();
