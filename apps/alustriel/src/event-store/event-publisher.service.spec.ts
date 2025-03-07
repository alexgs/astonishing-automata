/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { EVENT_TYPES } from '../character-builder/constants';

import { EventPublisherService } from './event-publisher.service';
import { EventReadModel } from './interfaces';
import { PostgresService } from './postgres.service';

describe('EventPublisherService', () => {
  let service: EventPublisherService;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockPostgresService: jest.Mocked<PostgresService>;
  let mockSql: { subscribe: jest.Mock };
  let mockUnsubscribe: jest.Mock;
  let mockLoggerDebug: jest.SpyInstance;
  let mockLoggerError: jest.SpyInstance;
  // eslint-disable-next-line @typescript-eslint/ban-types
  let eventCallback: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  let connectCallback: Function;

  beforeEach(async () => {
    mockUnsubscribe = jest.fn();
    mockSql = {
      subscribe: jest.fn().mockImplementation((channel, eventCb, connectCb) => {
        eventCallback = eventCb;
        connectCallback = connectCb;
        return { unsubscribe: mockUnsubscribe };
      }),
    };

    mockEventBus = {
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockPostgresService = {
      getSql: jest.fn().mockReturnValue(mockSql),
      close: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<PostgresService>;

    mockLoggerDebug = jest
      .spyOn(Logger.prototype, 'debug')
      .mockImplementation();
    mockLoggerError = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventPublisherService,
        { provide: EventBus, useValue: mockEventBus },
        { provide: PostgresService, useValue: mockPostgresService },
      ],
    }).compile();

    service = module.get<EventPublisherService>(EventPublisherService);

    // Mock setTimeout for faster tests
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('onModuleInit', () => {
    it('should subscribe to PostgreSQL events', async () => {
      await service.onModuleInit();

      expect(mockPostgresService.getSql).toHaveBeenCalled();
      expect(mockSql.subscribe).toHaveBeenCalledWith(
        'insert:events',
        expect.any(Function),
        expect.any(Function),
      );

      // Test the connect callback
      connectCallback();
      expect(mockLoggerDebug).toHaveBeenCalledWith(
        'Connected to PostgreSQL event stream.',
      );
    });

    it('should retry connection on failure', async () => {
      // Increase timeout for this specific test
      jest.setTimeout(10000);

      const originalSubscribe = mockSql.subscribe;
      mockSql.subscribe = jest
        .fn()
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockImplementationOnce(originalSubscribe);

      // Start initialization but don't await it yet
      const initPromise = service.onModuleInit();

      // Run one timer at a time to properly simulate the retry behavior
      jest.runOnlyPendingTimers(); // Process the first failed attempt
      jest.runOnlyPendingTimers(); // Process the retry timeout

      // Now await completion
      await initPromise;

      expect(mockSql.subscribe).toHaveBeenCalledTimes(2);
      expect(mockLoggerError).toHaveBeenCalledWith(
        'Event subscription failed (attempt 1):',
        expect.any(Error),
      );
    }, 10000);

    it('should throw error after maximum retries', async () => {
      mockSql.subscribe = jest
        .fn()
        .mockRejectedValue(new Error('Connection failed'));

      const initPromise = service.onModuleInit();
      jest.runAllTimers(); // Fast-forward all timeouts
      await expect(initPromise).rejects.toThrow('Connection failed');
      expect(mockSql.subscribe).toHaveBeenCalledTimes(5);
    });
  });

  describe('onModuleDestroy', () => {
    it('should unsubscribe and close connection', async () => {
      // First initialize to set up the unsubscribe function
      await service.onModuleInit();

      await service.onModuleDestroy();

      expect(mockUnsubscribe).toHaveBeenCalled();
      expect(mockPostgresService.close).toHaveBeenCalled();
      expect(mockLoggerDebug).toHaveBeenCalledWith(
        'Unsubscribed from PostgreSQL event stream.',
      );
    });

    it('should handle errors during unsubscribe', async () => {
      await service.onModuleInit();

      const error = new Error('Unsubscribe failed');
      mockUnsubscribe.mockImplementation(() => {
        throw error;
      });

      await service.onModuleDestroy();

      expect(mockLoggerError).toHaveBeenCalledWith(
        'Error unsubscribing from PostgreSQL event stream:',
        error,
      );
    });

    it('should handle errors during postgres service close', async () => {
      await service.onModuleInit();

      const error = new Error('Close failed');
      mockPostgresService.close.mockRejectedValue(error);

      await service.onModuleDestroy();

      expect(mockLoggerError).toHaveBeenCalledWith(
        'Error unsubscribing from PostgreSQL event stream:',
        error,
      );
    });
  });

  describe('event publishing', () => {
    it('should publish StepChangedEvent for STEP_CHANGED event type', async () => {
      await service.onModuleInit();

      const mockEvent: EventReadModel = {
        id: '123',
        stream_id: 'stream-1',
        data: { step: 'character-creation' },
        type: EVENT_TYPES.STEP_CHANGED,
        version: 1,
        created_at: new Date(),
      };

      eventCallback(mockEvent);

      expect(mockLoggerDebug).toHaveBeenCalledWith(
        `Publishing event: ${JSON.stringify(mockEvent)}`,
      );
      expect(mockEventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          characterId: 'stream-1',
          step: 'character-creation',
        }),
      );
    });

    it('should publish StepChangedEvent for STARTED event type (temporary behavior)', async () => {
      await service.onModuleInit();

      const mockEvent: EventReadModel = {
        id: '123',
        stream_id: 'stream-1',
        data: { step: 'initial-step' },
        type: EVENT_TYPES.STARTED,
        version: 1,
        created_at: new Date(),
      };

      eventCallback(mockEvent);

      expect(mockEventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          characterId: 'stream-1',
          step: 'initial-step',
        }),
      );
    });

    it('should throw error for unknown event types', async () => {
      await service.onModuleInit();

      const mockEvent: EventReadModel = {
        id: '123',
        stream_id: 'stream-1',
        data: { someData: 'value' },
        type: 'UNKNOWN_EVENT',
        version: 1,
        created_at: new Date(),
      };

      expect(() => eventCallback(mockEvent)).toThrow(
        'Unknown event type: UNKNOWN_EVENT',
      );
      expect(mockEventBus.publish).not.toHaveBeenCalled();
    });
  });
});
