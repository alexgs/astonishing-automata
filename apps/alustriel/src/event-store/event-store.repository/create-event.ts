/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Logger } from '@nestjs/common';
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
  logger?: Logger,
): Promise<EventWriteModel> {
  logger && logger.debug('>> Reading existing stream');
  let streamRecord = [];
  try {
    streamRecord = await knex<StreamRecord>('streams')
      .select()
      .where('id', payload.streamId);
  } catch (error) {
    if (error instanceof Error) {
      logger && logger.error(`Error reading stream: ${error.message}`);
      logger && logger.error(`Stack: ${error.stack}`);
      throw error;
    }
  }
  logger && logger.debug('>> Determining expected version');
  const expectedVersion =
    streamRecord.length === 0 ? 0 : streamRecord[0].version;
  logger && logger.debug('>> Returning event');
  return {
    id: ulid(),
    streamId: payload.streamId,
    streamType: payload.streamType,
    type: payload.eventType,
    data: payload.data,
    expectedVersion,
  };
}
