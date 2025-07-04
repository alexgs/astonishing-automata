/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { createActor } from 'xstate';

import { EVENT_TYPES } from '../character-builder/constants';
import { EventStoreService } from '../event-store/event-store.service';
import { testLog } from '../winston-transports';

import { ActorFactory } from './actor.factory';

jest.mock('xstate', () => {
  const mockCharacterBuilderMachine = {
    definition: {
      initial: {
        source: {
          id: 'initialStep',
        },
      },
    },
    resolveState: jest.fn(),
  };

  return {
    assign: jest.fn(),
    createActor: jest.fn(),
    createMachine: jest.fn(),
    setup: jest.fn(() => ({
      createMachine: jest.fn(() => mockCharacterBuilderMachine),
    })),
    __esModule: true,
    mockCharacterBuilderMachine,
  };
});

const mockEventStoreService = {
  getEventsByStreamId: jest.fn(),
};

const mockXState = jest.requireMock('xstate');

describe.skip('ActorFactory', () => {
  let actorFactory: ActorFactory;
  let eventStoreService: EventStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActorFactory,
        {
          provide: EventStoreService,
          useValue: mockEventStoreService,
        },
        {
          provide: Logger,
          useValue: WinstonModule.createLogger({
            transports: [testLog],
          }),
        },
      ],
    }).compile();

    actorFactory = module.get<ActorFactory>(ActorFactory);
    eventStoreService = module.get<EventStoreService>(EventStoreService);
  });

  it('is defined', () => {
    expect(actorFactory).toBeDefined();
  });

  describe('when there are no past events', () => {
    it('throws an error', async () => {
      mockEventStoreService.getEventsByStreamId.mockResolvedValue([]);
      const mockActor = { start: jest.fn() };
      mockXState.createActor.mockReturnValue(mockActor);

      await expect(actorFactory.getActor('characterId')).rejects.toThrow(
        '[ActorFactory] No past events found! This should never happen!',
      );

      expect(eventStoreService.getEventsByStreamId).toHaveBeenCalledWith(
        'characterId',
      );
    });
  });

  describe('when there is one past event', () => {
    it('creates a new actor', async () => {
      mockEventStoreService.getEventsByStreamId.mockResolvedValue([
        { type: EVENT_TYPES.STARTED, data: { step: 'step1' }, version: 1 },
      ]);
      const mockActor = { start: jest.fn() };
      mockXState.createActor.mockReturnValue(mockActor);

      const { actor, version } = await actorFactory.getActor('characterId');

      expect(eventStoreService.getEventsByStreamId).toHaveBeenCalledWith(
        'characterId',
      );
      expect(createActor).toHaveBeenCalledWith(
        mockXState.mockCharacterBuilderMachine,
      );
      expect(mockActor.start).toHaveBeenCalled();
      expect(actor).toBe(mockActor);
      expect(version).toBe(1);
    });
  });

  describe('when there are multiple past events', () => {
    it('rehydrates an actor with past events', async () => {
      const pastEvents = [
        { type: EVENT_TYPES.STARTED, data: { step: 'step1' }, version: 1 },
        {
          type: EVENT_TYPES.SPECIES_SELECTED,
          data: { skills: ['perception'] },
          version: 2,
        },
        { type: EVENT_TYPES.STEP_CHANGED, data: { step: 'step2' }, version: 3 },
      ];
      mockEventStoreService.getEventsByStreamId.mockResolvedValue(pastEvents);
      const mockActor = { start: jest.fn(), send: jest.fn() };
      mockXState.createActor.mockReturnValue(mockActor);

      const resolvedState = { value: 'step2', context: {} };
      mockXState.mockCharacterBuilderMachine.resolveState.mockReturnValue(
        resolvedState,
      );

      const { actor, version } = await actorFactory.getActor('characterId');

      expect(eventStoreService.getEventsByStreamId).toHaveBeenCalledWith(
        'characterId',
      );
      expect(createActor).toHaveBeenCalledWith(
        mockXState.mockCharacterBuilderMachine,
      );
      expect(mockActor.start).toHaveBeenCalled();
      expect(mockActor.send).toHaveBeenCalledTimes(pastEvents.length);
      expect(actor).toBe(mockActor);
      expect(version).toBe(pastEvents.length);
    });
  });
});
