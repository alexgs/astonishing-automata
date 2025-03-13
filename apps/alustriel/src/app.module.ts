/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { ZodValidationPipe } from 'nestjs-zod';

import { CharacterBuilderModule } from './character-builder/character-builder.module';
import { StateMachineModule } from './state-machine/state-machine.module';

@Module({
  controllers: [],
  imports: [
    CharacterBuilderModule,
    ConfigModule.forRoot(),
    CqrsModule.forRoot(),
    StateMachineModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
