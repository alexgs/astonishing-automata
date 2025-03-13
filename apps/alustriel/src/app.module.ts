/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

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
  providers: [Logger],
})
export class AppModule {}
