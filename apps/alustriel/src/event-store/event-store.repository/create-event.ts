/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { knex } from 'knex';
import { ulid } from 'ulidx';

import {
  CreateEventPayload,
  EventWriteModel,
  StreamRecord,
} from '../interfaces';

export async function createEvent(
  knex: knex.Knex,
  payload: CreateEventPayload,
): Promise<EventWriteModel> {
  let streamRecord = [];
  try {
    streamRecord = await knex<StreamRecord>('streams')
      .select()
      .where('id', payload.streamId);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
  const expectedVersion =
    streamRecord.length === 0 ? 0 : streamRecord[0].version;
  return {
    id: ulid(),
    streamId: payload.streamId,
    streamType: payload.streamType,
    type: payload.eventType,
    data: payload.data,
    expectedVersion,
  };
}
