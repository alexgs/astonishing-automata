/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TOKENS } from '../provider-tokens';

import { EventPublisherService } from './event-publisher.service';
import { EventStoreService } from './event-store.service';
import { KnexService } from './knex.service';
import { PostgresService } from './postgres.service';

@Module({
  exports: [EventStoreService],
  imports: [ConfigModule],
  providers: [
    EventPublisherService,
    EventStoreService,
    KnexService,
    {
      provide: TOKENS.POSTGRES_SERVICE,
      useClass: PostgresService,
    },
  ],
})
export class EventStoreModule {}
