/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Logger, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import { EventStoreModule } from '../event-store/event-store.module';

import { ActorFactory } from './actor.factory';

@Module({
  exports: [ActorFactory],
  imports: [EventStoreModule, WinstonModule],
  providers: [ActorFactory, Logger],
})
export class StateMachineModule {}
