/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { knex } from 'knex';
import { createTracker, MockClient, Tracker } from 'knex-mock-client';

import { EventWriteModel } from '../interfaces';

import { appendEvent } from './append-event';

describe('Pure function `appendEvent`', () => {
  let db: knex.Knex;
  let tracker: Tracker;

  beforeEach(() => {
    db = knex({ client: MockClient });
    tracker = createTracker(db);
  });

  afterEach(() => {
    tracker.reset();
  });

  describe('when a stream record does not exist', () => {
    const event: EventWriteModel = {
      expectedVersion: 0,
      data: { title: 'Star Wars', year: '1977' },
      id: '01HJ659NEF95QMJHSMGN36VA7J',
      streamId: 'ebe6d909-5976-4b64-8445-3b726ab891a4',
      streamType: 'movie',
      type: 'event-types.movie-created',
    };

    it('checks for an existing stream', async () => {
      tracker.on.insert('streams').response(1);
      tracker.on.select('streams').response([
        {
          id: event.streamId,
          type: event.streamType,
          version: 0,
        },
      ]);
      tracker.on.insert('events').response(1);
      tracker.on.update('streams').response(1);

      await appendEvent(db, event);

      const firstQuery = tracker.history.select[0];
      expect(firstQuery.method).toBe('select');
      expect(firstQuery.bindings).toContain(event.streamId);
    });

    it('inserts a new stream', async () => {
      tracker.on.insert('streams').response(1);
      tracker.on.select('streams').response([
        {
          id: event.streamId,
          type: event.streamType,
          version: 0,
        },
      ]);
      tracker.on.insert('events').response(1);
      tracker.on.update('streams').response(1);

      await appendEvent(db, event);

      const insertQuery = tracker.history.insert[0];
      expect(insertQuery.method).toBe('insert');
      expect(insertQuery.bindings).toEqual([
        event.streamId,
        event.streamType,
        0,
      ]);
    });

    it('inserts a new event', async () => {
      tracker.on.insert('streams').response(1);
      tracker.on.select('streams').response([
        {
          id: event.streamId,
          type: event.streamType,
          version: 0,
        },
      ]);
      tracker.on.insert('events').response(1);
      tracker.on.update('streams').response(1);

      await appendEvent(db, event);

      const insertEventQuery = tracker.history.insert[1];
      expect(insertEventQuery.method).toBe('insert');
      expect(insertEventQuery.bindings).toEqual([
        JSON.stringify(event.data),
        event.id,
        event.streamId,
        event.type,
        event.expectedVersion + 1,
      ]);
    });

    it('updates the stream version', async () => {
      tracker.on.insert('streams').response(1);
      tracker.on.select('streams').response([
        {
          id: event.streamId,
          type: event.streamType,
          version: 0,
        },
      ]);
      tracker.on.insert('events').response(1);
      tracker.on.update('streams').response(1);

      await appendEvent(db, event);

      const updateQuery = tracker.history.update[0];
      expect(updateQuery.method).toBe('update');
      expect(updateQuery.bindings).toEqual([
        event.expectedVersion + 1,
        event.streamId,
      ]);
    });
  });

  describe.skip('when a stream record exists', () => {
    const event: EventWriteModel = {
      expectedVersion: 4,
      data: { title: 'Star Wars', year: '1977' },
      id: '01HJ659NEF95QMJHSMGN36VA7J',
      streamId: 'ebe6d909-5976-4b64-8445-3b726ab891a4',
      streamType: 'movie',
      type: 'event-types.movie-created',
    };

    it('checks for an existing stream', async () => {
      tracker.on.select('streams').response([
        {
          id: event.streamId,
          type: event.streamType,
          version: event.expectedVersion,
        },
      ]);
      tracker.on.insert('events').response(1);
      tracker.on.update('streams').response(1);

      await appendEvent(db, event);

      const firstQuery = tracker.history.select[0];
      expect(firstQuery.method).toBe('select');
      expect(firstQuery.bindings).toContain(event.streamId);
    });

    it('inserts a new event', async () => {
      tracker.on.select('streams').response([
        {
          id: event.streamId,
          type: event.streamType,
          version: event.expectedVersion,
        },
      ]);
      tracker.on.insert('events').response(1);
      tracker.on.update('streams').response(1);

      await appendEvent(db, event);

      const insertEventQuery = tracker.history.insert[0];
      expect(insertEventQuery.method).toBe('insert');
      expect(insertEventQuery.bindings).toEqual([
        event.id,
        event.data,
        event.streamId,
        event.type,
        event.expectedVersion + 1,
      ]);
    });

    it('updates the stream version', async () => {
      tracker.on.select('streams').response([
        {
          id: event.streamId,
          type: event.streamType,
          version: event.expectedVersion,
        },
      ]);
      tracker.on.insert('events').response(1);
      tracker.on.update('streams').response(1);

      await appendEvent(db, event);

      const updateQuery = tracker.history.update[0];
      expect(updateQuery.method).toBe('update');
      expect(updateQuery.bindings).toEqual([
        event.expectedVersion + 1,
        event.streamId,
      ]);
    });
  });

  describe.skip('error handling', () => {
    const event: EventWriteModel = {
      expectedVersion: 4,
      data: { title: 'Star Wars', year: '1977' },
      id: '01HJ659NEF95QMJHSMGN36VA7J',
      streamId: 'ebe6d909-5976-4b64-8445-3b726ab891a4',
      streamType: 'movie',
      type: 'event-types.movie-created',
    };

    it('throws error when stream not found after insertion', async () => {
      tracker.on.select('streams').response([]);
      tracker.on.insert('streams').response(1);
      tracker.on.select('streams').response([]);

      await expect(appendEvent(db, event)).rejects.toThrow(
        `Stream not found after insertion: ${event.streamId}`,
      );
    });

    it('throws error when stream version does not match expected version', async () => {
      tracker.on.select('streams').response([
        {
          id: event.streamId,
          type: event.streamType,
          version: event.expectedVersion + 1, // Incorrect version
        },
      ]);

      await expect(appendEvent(db, event)).rejects.toThrow(
        `Stream version ${event.expectedVersion + 1} and expected version ${event.expectedVersion} do not match.`,
      );
    });
  });
});
