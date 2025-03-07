/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Injectable } from '@nestjs/common';
import { knex } from 'knex';

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

  constructor(knexService: KnexService) {
    this.knex = knexService.getKnex();
  }

  async appendEvent(event: EventWriteModel) {
    return appendEvent(this.knex, event);
  }

  async createEvent(
    streamId: string,
    streamType: string,
    eventType: string,
    data: EventPayloads | Record<string, unknown>,
  ): Promise<EventWriteModel> {
    return createEvent(this.knex, {
      data,
      eventType,
      streamId,
      streamType,
    });
  }

  async getEventsByStreamId(streamId: string): Promise<EventReadModel[]> {
    return getEventsByStreamId(this.knex, streamId);
  }
}
