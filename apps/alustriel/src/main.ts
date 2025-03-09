/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ level, message, timestamp }) => {
              return `${timestamp} [${level.toUpperCase()}]: ${message}`;
            }),
          ),
        }),
        // You can add more transports here (e.g., File transport)
      ],
    }),
  });
  app.enableShutdownHooks(); // Consider disabling for tests; see https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown
  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix('api');

  await app.listen(3000);
}

void bootstrap();
