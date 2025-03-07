/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import * as postgres from 'postgres';

import { EventReadModel } from '../src/event-store/interfaces';

type SubscribeHandler = (
  row: postgres.Row | null,
  info: postgres.ReplicationEvent,
) => void;

export const mockPostgresService = {
  close: jest.fn(),
  getSql: jest.fn(() => ({
    subscribe: jest.fn(
      (
        channel: string,
        handler: SubscribeHandler,
        onSubscribe?: () => void,
      ) => {
        if (onSubscribe) {
          onSubscribe();
        }

        // Simulate an event notification
        // const row: EventReadModel = {
        //   id: '123',
        //   type: 'STEP_CHANGED',
        //   data: {},
        //   created_at: new Date(),
        //   stream_id: 'mock-stream',
        //   version: 1,
        // };
        // const info: postgres.ReplicationEvent = {
        //   command: 'insert',
        //   relation: {
        //     schema: 'public',
        //     table: 'events',
        //     columns: [],
        //     keys: [],
        //   },
        // };
        // setTimeout(() => handler(row, info), 100);

        // Return a (mock) subscription handle
        return { unsubscribe: jest.fn() };
      },
    ),
  })),
};
