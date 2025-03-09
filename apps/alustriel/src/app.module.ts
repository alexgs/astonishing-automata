/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharacterBuilderModule } from './character-builder/character-builder.module';

@Module({
  controllers: [AppController],
  imports: [
    CharacterBuilderModule,
    ConfigModule.forRoot(),
    CqrsModule.forRoot(),
  ],
  providers: [AppService, Logger],
})
export class AppModule {}
