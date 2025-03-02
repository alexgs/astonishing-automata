/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Knex } from 'knex';
import { EventWriteModel, StreamRecord } from './interfaces';

export async function appendEvent(knex: Knex, event: EventWriteModel) {
  await knex.transaction(async (trx) => {
    try {
      // Insert into stream table if there is no stream with provided streamId
      await trx('streams')
        .insert({ id: event.streamId, type: event.streamType, version: 0 })
        .onConflict('id')
        .ignore();

      // Fetch stream record
      const [streamRecord] = await trx<StreamRecord>('streams')
        .select()
        .where('id', event.streamId);

      if (!streamRecord) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(`Stream not found after insertion: ${event.streamId}`);
      }

      if (streamRecord.version !== event.expectedVersion) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(
          `Stream version ${streamRecord.version} and expected version ${event.expectedVersion} do not match.`,
        );
      }

      // Insert new row into events table with version equal to expected_stream_version + 1
      await trx('events').insert({
        id: event.id,
        data: event.data,
        stream_id: event.streamId,
        type: event.type,
        version: event.expectedVersion + 1,
      });

      // Update stream version with expected_stream_version + 1
      await trx('streams')
        .where('id', event.streamId)
        .update({ version: event.expectedVersion + 1 });
    } catch (error) {
      console.error('Error appending event:', error);
      throw error; // Ensure transaction rollback
    }
  });
}
