/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { EVENT_TYPES } from '../character-builder/constants';
import { TOKENS } from '../provider-tokens';
import { STEPS } from '../state-machine/constants';

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
      subscribe: jest
        .fn()
        .mockImplementation((_channel, eventCb, connectCb) => {
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
        { provide: TOKENS.POSTGRES_SERVICE, useValue: mockPostgresService },
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
      // Save the current timer implementation and use real timers for this test
      jest.useRealTimers();

      const originalSubscribe = mockSql.subscribe;
      mockSql.subscribe = jest
        .fn()
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockImplementationOnce(originalSubscribe);

      await service.onModuleInit();

      expect(mockSql.subscribe).toHaveBeenCalledTimes(2);
      expect(mockLoggerError).toHaveBeenCalledWith(
        'Event subscription failed (attempt 1):',
        expect.any(Error),
      );

      // Restore fake timers for other tests
      jest.useFakeTimers();
    }, 15000); // Extend timeout further if needed

    it('should throw error after maximum retries', async () => {
      // Use real timers for this test
      jest.useRealTimers();

      // Save original setTimeout and create a properly typed replacement
      const originalSetTimeout = global.setTimeout;

      // Create a mock that preserves the original function's properties
      const mockSetTimeout = function (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: (...args: any[]) => void,
        _delay?: number,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...args: any[]
      ) {
        return originalSetTimeout(callback, 10, ...args); // Short delay for testing
      } as typeof originalSetTimeout;

      // Replace the global setTimeout
      global.setTimeout = mockSetTimeout;

      // Mock the subscribe function to always fail
      mockSql.subscribe = jest
        .fn()
        .mockRejectedValue(new Error('Connection failed'));

      // Run the service
      const initPromise = service.onModuleInit();
      await expect(initPromise).rejects.toThrow('Connection failed');
      expect(mockSql.subscribe).toHaveBeenCalledTimes(5);

      // Restore fake timers for other tests
      jest.useFakeTimers();

      // Restore original setTimeout
      global.setTimeout = originalSetTimeout;
    }, 15000); // Extend timeout further if needed
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
      const characterId = 'fe92cd2c-9275-4b01-aef1-ab610ca5967d';

      await service.onModuleInit();

      const mockEvent: EventReadModel = {
        id: '123',
        stream_id: characterId,
        data: {
          characterId,
          previousStep: STEPS.SELECT_SPECIES,
          nextStep: STEPS.SELECT_CLASS,
        },
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
          characterId,
          previousStep: STEPS.SELECT_SPECIES,
          nextStep: STEPS.SELECT_CLASS,
        }),
      );
    });

    it('should publish StepChangedEvent for STARTED event type (temporary behavior)', async () => {
      const characterId = 'fe92cd2c-9275-4b01-aef1-ab610ca5967d';

      await service.onModuleInit();

      const mockEvent: EventReadModel = {
        id: '123',
        stream_id: characterId,
        data: {
          characterId,
          previousStep: STEPS.SELECT_SPECIES,
          nextStep: STEPS.SELECT_CLASS,
        },
        type: EVENT_TYPES.STARTED,
        version: 1,
        created_at: new Date(),
      };

      eventCallback(mockEvent);

      expect(mockEventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          characterId,
          previousStep: STEPS.SELECT_SPECIES,
          nextStep: STEPS.SELECT_CLASS,
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
