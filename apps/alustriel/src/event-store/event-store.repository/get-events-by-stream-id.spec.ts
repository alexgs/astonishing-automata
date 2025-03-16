/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { knex } from 'knex';
import { createTracker, MockClient, Tracker } from 'knex-mock-client';

import { EventStoreReadModel } from '../interfaces';

import { getEventsByStreamId } from './get-events-by-stream-id';

describe('Pure function `getEventsByStreamId`', () => {
  let db: knex.Knex;
  let tracker: Tracker;

  beforeEach(() => {
    db = knex({ client: MockClient });
    tracker = createTracker(db);
  });

  afterEach(() => {
    tracker.reset();
  });

  const streamId = 'ebe6d909-5976-4b64-8445-3b726ab891a4';

  it('queries the events table with the correct streamId', async () => {
    tracker.on.select('events').response([]);

    await getEventsByStreamId(db, streamId);

    const query = tracker.history.select[0];
    expect(query.method).toBe('select');
    expect(query.bindings).toContain(streamId);
  });

  it('returns an empty array when no events exist for the stream', async () => {
    tracker.on.select('events').response([]);

    const result = await getEventsByStreamId(db, streamId);

    expect(result).toEqual([]);
  });

  it('returns events ordered by ID in ascending order', async () => {
    const mockEvents: EventStoreReadModel[] = [
      {
        id: '01JPDAR7NYDG205HKPVZBPZJRJ',
        data: { title: 'Star Wars', year: '1977' },
        stream_id: streamId,
        type: 'event-types.movie-created',
        version: 1,
        created_at: new Date('2023-01-01'),
      },
      {
        id: '01JPDAR8VXP0VECAYRN5GCP3X2',
        data: { title: 'Star Wars', year: '1977', director: 'George Lucas' },
        stream_id: streamId,
        type: 'event-types.movie-updated',
        version: 2,
        created_at: new Date('2023-01-02'),
      },
    ];

    tracker.on.select('events').response(mockEvents);

    const result = await getEventsByStreamId(db, streamId);

    expect(result).toEqual(mockEvents);

    // Verify the ordering clause was applied
    const query = tracker.history.select[0];
    const sqlString = query.sql.toUpperCase();
    expect(sqlString).toContain('ORDER BY');
    expect(sqlString).toContain('ID');
    expect(sqlString).toContain('ASC');
  });

  it('returns multiple events when they exist', async () => {
    const mockEvents: EventStoreReadModel[] = [
      {
        id: '01JPDAR7NYDG205HKPVZBPZJRJ',
        data: { title: 'Star Wars', year: '1977' },
        stream_id: streamId,
        type: 'event-types.movie-created',
        version: 1,
        created_at: new Date('2023-01-01'),
      },
      {
        id: '01JPDAR8VXP0VECAYRN5GCP3X2',
        data: { title: 'Star Wars', year: '1977', director: 'George Lucas' },
        stream_id: streamId,
        type: 'event-types.movie-updated',
        version: 2,
        created_at: new Date('2023-01-02'),
      },
    ];

    tracker.on.select('events').response(mockEvents);

    const result = await getEventsByStreamId(db, streamId);

    expect(result).toHaveLength(2);
    expect(result).toEqual(mockEvents);
  });
});
