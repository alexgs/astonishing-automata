/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { knex } from 'knex';
import { createTracker, MockClient, Tracker } from 'knex-mock-client';
import * as ulidModule from 'ulidx';

import { CreateEventPayload, StreamRecord } from '../interfaces';

import { createEvent } from './create-event';

describe('Pure function `createEvent`', () => {
  let db: knex.Knex;
  let tracker: Tracker;
  const mockUlid = '01HJ659NEF95QMJHSMGN36VA7J';

  beforeEach(() => {
    db = knex({ client: MockClient, dialect: 'pg' });
    tracker = createTracker(db);
    jest.spyOn(ulidModule, 'ulid').mockReturnValue(mockUlid);
  });

  afterEach(() => {
    tracker.reset();
    jest.restoreAllMocks();
  });

  describe('when a stream record does not exist', () => {
    const payload: CreateEventPayload = {
      data: { title: 'Star Wars', year: '1977' },
      eventType: 'event-types.movie-created',
      streamId: 'ebe6d909-5976-4b64-8445-3b726ab891a4',
      streamType: 'movie',
    };

    it('queries the streams table with the correct streamId', async () => {
      tracker.on.select('streams').response([]);

      await createEvent(db, payload);

      const query = tracker.history.select[0];
      expect(query.method).toBe('select');
      expect(query.bindings).toContain(payload.streamId);
    });

    it('returns the correct EventWriteModel with expectedVersion 0', async () => {
      tracker.on.select('streams').response([]);

      const result = await createEvent(db, payload);

      expect(result).toEqual({
        id: mockUlid,
        data: payload.data,
        expectedVersion: 0,
        streamId: payload.streamId,
        streamType: payload.streamType,
        type: payload.eventType,
      });
    });
  });

  describe('when a stream record exists', () => {
    const payload: CreateEventPayload = {
      data: { title: 'The Empire Strikes Back', year: '1980' },
      eventType: 'event-types.movie-created',
      streamId: 'ebe6d909-5976-4b64-8445-3b726ab891a4',
      streamType: 'movie',
    };
    const streamRecord: StreamRecord = {
      id: payload.streamId,
      type: payload.streamType,
      version: 5,
    };

    it('queries the streams table with the correct streamId', async () => {
      tracker.on.select('streams').response([streamRecord]);

      await createEvent(db, payload);

      const query = tracker.history.select[0];
      expect(query.method).toBe('select');
      expect(query.bindings).toContain(payload.streamId);
    });

    it('returns the correct EventWriteModel with expectedVersion from stream record', async () => {
      tracker.on.select('streams').response([streamRecord]);

      const result = await createEvent(db, payload);

      expect(result).toEqual({
        id: mockUlid,
        data: payload.data,
        expectedVersion: 5,
        streamId: payload.streamId,
        streamType: payload.streamType,
        type: payload.eventType,
      });
    });
  });

  it('handles empty data object', async () => {
    const payload: CreateEventPayload = {
      data: {},
      eventType: 'event-types.empty-event',
      streamId: 'ebe6d909-5976-4b64-8445-3b726ab891a4',
      streamType: 'empty',
    };

    tracker.on.select('streams').response([]);

    const result = await createEvent(db, payload);

    expect(result.data).toEqual({});
  });

  it('preserves complex data structures in the payload', async () => {
    const complexData = {
      nested: { object: true },
      array: [1, 2, 3],
      null: null,
      mixed: { array: ['a', 'b'] },
    };

    const payload: CreateEventPayload = {
      data: complexData,
      eventType: 'event-types.complex-event',
      streamId: 'ebe6d909-5976-4b64-8445-3b726ab891a4',
      streamType: 'complex',
    };

    tracker.on.select('streams').response([]);

    const result = await createEvent(db, payload);

    expect(result.data).toEqual(complexData);
  });
});
