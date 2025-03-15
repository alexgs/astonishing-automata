/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { knex } from 'knex';

import { EventStoreReadModel } from '../interfaces';

export async function getEventsByStreamId(
  knex: knex.Knex,
  streamId: string,
): Promise<EventStoreReadModel[]> {
  return knex<EventStoreReadModel>('events')
    .select()
    .where('stream_id', streamId)
    .orderBy('id', 'asc');
}
