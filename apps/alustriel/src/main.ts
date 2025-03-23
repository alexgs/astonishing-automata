/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { clerkMiddleware } from '@clerk/express';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';

import { AppModule } from './app.module';
import { appLog, consoleLog } from './winston-transports';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: WinstonModule.createLogger({
      transports: [appLog, consoleLog],
    }),
  });

  // Access the raw Express app & register Clerk middleware
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(clerkMiddleware());

  app.enableShutdownHooks();
  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix('api');

  await app.listen(3000);
}

void bootstrap();
