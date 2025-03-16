/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Module } from '@nestjs/common';

// Mock service implementations
const mockEventPublisherService = {
  onModuleInit: jest.fn().mockResolvedValue(undefined),
  onModuleDestroy: jest.fn().mockResolvedValue(undefined),
};

export const mockEventStoreService = {
  saveEvent: jest.fn().mockResolvedValue({ id: 'mock-event-id' }),
  getEvents: jest.fn().mockResolvedValue([]),
  getEventsByStreamId: jest.fn().mockResolvedValue([]),
};

const mockKnexService = {
  getKnex: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue([{ id: 'mock-id' }]),
  }),
  close: jest.fn().mockResolvedValue(undefined),
};

const mockPostgresService = {
  getSql: jest.fn().mockReturnValue({
    subscribe: jest.fn().mockReturnValue({
      unsubscribe: jest.fn(),
    }),
  }),
  close: jest.fn().mockResolvedValue(undefined),
};

// Mock providers
const mockProviders = [
  {
    provide: 'EventPublisherService',
    useValue: mockEventPublisherService,
  },
  {
    provide: 'EventStoreService',
    useValue: mockEventStoreService,
  },
  {
    provide: 'KnexService',
    useValue: mockKnexService,
  },
  {
    provide: 'PostgresService',
    useValue: mockPostgresService,
  },
];

// Create the mock module
@Module({
  exports: ['EventStoreService'],
  providers: mockProviders,
})
class MockEventStoreModule {}

// Export the complete mock module configuration
export const mockEventStoreModule = {
  module: MockEventStoreModule,
  providers: mockProviders,
  exports: ['EventStoreService'],
};
