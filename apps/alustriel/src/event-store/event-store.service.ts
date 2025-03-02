import { Injectable } from '@nestjs/common';
import { knex } from 'knex';
import { ulid } from 'ulidx';
import { appendEvent } from './append-event';
import {
  EventReadModel,
  EventWriteModel,
  StreamRecord,
} from './interfaces';
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
    data: Record<string, unknown>,
  ): Promise<EventWriteModel> {
    const streamRecord = await this.knex<StreamRecord>('streams')
      .select()
      .where('id', streamId);
    const expectedVersion =
      streamRecord.length === 0 ? 0 : streamRecord[0].version;
    return {
      id: ulid(),
      streamId,
      streamType,
      type: eventType,
      data,
      expectedVersion,
    };
  }

  async getEventsByStreamId(streamId: string): Promise<EventReadModel[]> {
    return this.knex<EventReadModel>('events')
      .select()
      .where('stream_id', streamId)
      .orderBy('version', 'asc');
  }
}
