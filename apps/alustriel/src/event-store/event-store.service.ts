/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Inject, Injectable, Logger } from '@nestjs/common';
import { knex } from 'knex';

import { TOKENS } from '../provider-tokens';

import {
  appendEvent,
  createEvent,
  getEventsByStreamId,
} from './event-store.repository';
import { EventStoreReadModel, EventStoreWriteModel } from './interfaces';
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

  async appendEvent(event: EventStoreWriteModel) {
    return appendEvent(this.knex, event, this.logger);
  }

  async createEvent(
    streamId: string,
    streamType: string,
    eventType: string,
    data: unknown,
  ): Promise<EventStoreWriteModel> {
    try {
      return createEvent(this.knex, {
        data,
        eventType,
        streamId,
        streamType,
      });
    } catch (error) {
      this.logger.error(
        `Error creating event: ${error}`,
        EventStoreService.name,
      );
      throw error;
    }
  }

  async getEventsByStreamId(streamId: string): Promise<EventStoreReadModel[]> {
    // TODO Make sure events are returned in order
    return getEventsByStreamId(this.knex, streamId);
  }
}
