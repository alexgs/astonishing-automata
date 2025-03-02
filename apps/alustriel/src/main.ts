/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks(); // Consider disabling for tests; see https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown
  await app.listen(3000);
}

void bootstrap();
