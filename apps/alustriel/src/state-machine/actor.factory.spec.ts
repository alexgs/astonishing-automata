/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createActor } from 'xstate';

import { EVENT_TYPES } from '../character-builder/constants';
import { StepChangedEvent } from '../character-builder/events/step-changed.event';
import { EventStoreService } from '../event-store/event-store.service';

import { ActorFactory } from './actor.factory';
import { characterBuilderMachine } from './state-machine';

const mockEventStoreService = {
  getEventsByStreamId: jest.fn(),
};

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
    createActor: jest.fn(),
    createMachine: jest.fn(),
    setup: jest.fn(() => ({
      createMachine: jest.fn(() => mockCharacterBuilderMachine),
    })),
    __esModule: true,
    mockCharacterBuilderMachine,
  };
});

const { mockCharacterBuilderMachine } = jest.requireMock('xstate');

describe('ActorFactory', () => {
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
        Logger,
      ],
    }).compile();

    actorFactory = module.get<ActorFactory>(ActorFactory);
    eventStoreService = module.get<EventStoreService>(EventStoreService);
  });

  it('should be defined', () => {
    expect(actorFactory).toBeDefined();
  });

  it('should create a new actor if no past events', async () => {
    mockEventStoreService.getEventsByStreamId.mockResolvedValue([]);
    const mockActor = { start: jest.fn() };
    (createActor as jest.Mock).mockReturnValue(mockActor);

    const actor = await actorFactory.getActor('characterId');

    expect(eventStoreService.getEventsByStreamId).toHaveBeenCalledWith(
      'characterId',
    );
    expect(createActor).toHaveBeenCalledWith(mockCharacterBuilderMachine);
    expect(mockActor.start).toHaveBeenCalled();
    expect(actor).toBe(mockActor);
  });

  it('should rehydrate actor with past events', async () => {
    const pastEvents = [
      { type: EVENT_TYPES.STEP_CHANGED, data: { step: 'step1' } },
      { type: 'data-changed', data: { skills: ['perception'] } },
      { type: EVENT_TYPES.STEP_CHANGED, data: { step: 'step2' } },
    ];
    mockEventStoreService.getEventsByStreamId.mockResolvedValue(pastEvents);
    const mockActor = { start: jest.fn() };
    (createActor as jest.Mock).mockReturnValue(mockActor);

    const resolvedState = { value: 'step2', context: {} };
    mockCharacterBuilderMachine.resolveState.mockReturnValue(resolvedState);

    const actor = await actorFactory.getActor('characterId');

    expect(eventStoreService.getEventsByStreamId).toHaveBeenCalledWith(
      'characterId',
    );
    expect(createActor).toHaveBeenCalledWith(mockCharacterBuilderMachine, {
      snapshot: expect.objectContaining({
        value: 'step2',
      }),
    });
    expect(mockActor.start).toHaveBeenCalled();
    expect(actor).toBe(mockActor);
  });
});
