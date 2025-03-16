/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import * as postgres from 'postgres';

import { EventStoreReadModel } from '../src/event-store/interfaces';

type SubscribeHandler = (
  row: postgres.Row | null,
  info: postgres.ReplicationEvent,
) => void;

// Store handlers by channel name
const subscriptionHandlers: Record<string, SubscribeHandler> = {};

export const mockPostgresService = {
  close: jest.fn(),
  getSql: jest.fn(() => ({
    subscribe: jest.fn(
      (
        channel: string,
        handler: SubscribeHandler,
        onSubscribe?: () => void,
      ) => {
        // Store the handler for external access
        subscriptionHandlers[channel] = handler;

        if (onSubscribe) {
          onSubscribe();
        }

        return { unsubscribe: jest.fn() };
      },
    ),
  })),

  // Method to trigger a subscription handler from outside
  triggerSubscription: (
    channel: string,
    row: EventStoreReadModel | null,
    info: Partial<postgres.ReplicationEvent> = {},
  ) => {
    if (subscriptionHandlers[channel]) {
      subscriptionHandlers[channel](row, info as postgres.ReplicationEvent);
    } else {
      console.warn(`No handler registered for channel: ${channel}`);
    }
  },
};
