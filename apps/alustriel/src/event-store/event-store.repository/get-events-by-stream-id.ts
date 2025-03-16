/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
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
