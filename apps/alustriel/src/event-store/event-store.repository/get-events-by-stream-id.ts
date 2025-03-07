/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { knex } from 'knex';

import { EventReadModel } from '../interfaces';

export async function getEventsByStreamId(
  knex: knex.Knex,
  streamId: string,
): Promise<EventReadModel[]> {
  return knex<EventReadModel>('events')
    .select()
    .where('stream_id', streamId)
    .orderBy('version', 'asc');
}
