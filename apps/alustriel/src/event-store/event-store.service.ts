/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Inject, Injectable, Logger } from '@nestjs/common';
import { knex } from 'knex';

import { TOKENS } from '../provider-tokens';

import {
  appendEvent,
  createEvent,
  getEventsByStreamId,
} from './event-store.repository';
import { EventPayloads, EventReadModel, EventWriteModel } from './interfaces';
import { KnexService } from './knex.service';

@Injectable()
export class EventStoreService {
  private readonly knex: knex.Knex;

  constructor(
    @Inject(TOKENS.KNEX_SERVICE) knexService: KnexService,
    private readonly logger: Logger,
  ) {
    this.knex = knexService.getKnex();
  }

  async appendEvent(event: EventWriteModel) {
    return appendEvent(this.knex, event, this.logger);
  }

  async createEvent(
    streamId: string,
    streamType: string,
    eventType: string,
    data: EventPayloads | Record<string, unknown>,
  ): Promise<EventWriteModel> {
    this.logger.debug('Creating event');
    try {
      return createEvent(
        this.knex,
        {
          data,
          eventType,
          streamId,
          streamType,
        },
        this.logger,
      );
    } catch (error) {
      this.logger.error(`Error creating event: ${error}`);
      throw error;
    }
  }

  async getEventsByStreamId(streamId: string): Promise<EventReadModel[]> {
    return getEventsByStreamId(this.knex, streamId);
  }
}
