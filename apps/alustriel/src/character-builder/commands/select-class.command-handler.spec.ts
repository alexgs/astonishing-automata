/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { EventStoreService } from '../../event-store/event-store.service';
import { ActorFactory } from '../../state-machine/actor.factory';
import { EVENT_TYPES } from '../constants';
import { CharacterBuilderEventFactory } from '../events/character-builder.event-factory';
import { InvalidActionException } from '../exceptions/invalid-action.exception';

import { SelectClassCommand } from './select-class.command';
import { SelectClassCommandHandler } from './select-class.command-handler';

describe('SelectClassCommandHandler', () => {
  const CHARACTER_ID = 'char-123';
  const CLASS_NAME = 'wizard';

  let handler: SelectClassCommandHandler;
  let mockActorFactory: { getActor: jest.Mock };
  let realActorFactory: ActorFactory;
  let eventFactory: { createClassSelectedEvent: jest.Mock };
  let eventStoreService: { appendEvent: jest.Mock };
  let logger: Logger;

  beforeEach(async () => {
    mockActorFactory = {
      getActor: jest.fn(),
    };

    eventFactory = {
      createClassSelectedEvent: jest.fn(),
    };

    eventStoreService = {
      appendEvent: jest.fn(),
    };

    logger = new Logger();

    const moduleRef = await Test.createTestingModule({
      providers: [
        SelectClassCommandHandler,
        { provide: ActorFactory, useValue: mockActorFactory },
        { provide: CharacterBuilderEventFactory, useValue: eventFactory },
        { provide: EventStoreService, useValue: eventStoreService },
        { provide: Logger, useValue: logger },
      ],
    }).compile();

    handler = moduleRef.get<SelectClassCommandHandler>(
      SelectClassCommandHandler,
    );

    realActorFactory = new ActorFactory(
      moduleRef.get<EventStoreService>(EventStoreService),
      logger,
    );
  });

  it('throws an "InvalidActionException" if FSM disallows the action', async () => {
    const { actor, version } = realActorFactory.hydrateActor([
      {
        id: '1',
        data: {},
        stream_id: CHARACTER_ID,
        type: EVENT_TYPES.STARTED,
        version: 1,
        created_at: new Date('2025-01-01'),
      },
    ]);
    mockActorFactory.getActor.mockResolvedValue({ actor, version });
    const command = new SelectClassCommand(CHARACTER_ID, CLASS_NAME);

    // Act & assert
    await expect(handler.execute(command)).rejects.toThrow(
      InvalidActionException,
    );
  });

  // it('should throw InvalidActionException if current state disallows the action', async () => {
  //   // TODO Rewrite this so that `actor.can` uses XState, not a mock, and genuinely fails
  //   const snapshot = {
  //     value: 'TEST>SELECT_SPECIES',
  //     can: jest.fn().mockReturnValue(false),
  //   };
  //   const actor = { getSnapshot: () => snapshot };
  //   actorFactory.getActor.mockResolvedValue({ actor, VERSION });
  //   const command = new SelectClassCommand(CHARACTER_ID, CLASS_NAME);
  //
  //   await expect(
  //     // Act
  //     handler.execute(command),
  //   ).rejects.toThrow(InvalidActionException);
  //
  //   expect(snapshot.can).toHaveBeenCalledWith({
  //     type: ACTIONS.SELECT_CLASS,
  //     className: CLASS_NAME,
  //   });
  // });

  // it('should append event if action is valid', async () => {
  //   // TODO Rewrite this so that `actor.can` uses XState, not a mock, and genuinely fails
  //   const expectedEvent = {
  //     type: 'ClassSelected',
  //     data: {
  //       characterId: CHARACTER_ID,
  //       className: CLASS_NAME,
  //     },
  //   };
  //   const snapshot = {
  //     value: 'selectClass',
  //     can: jest.fn().mockReturnValue(true),
  //   };
  //   const actor = { getSnapshot: () => snapshot };
  //
  //   actorFactory.getActor.mockResolvedValue({ actor, version: VERSION });
  //   eventFactory.createClassSelectedEvent.mockResolvedValue(expectedEvent);
  //
  //   const command = new SelectClassCommand(CHARACTER_ID, CLASS_NAME);
  //   const result = await handler.execute(command);
  //
  //   expect(snapshot.can).toHaveBeenCalledWith({
  //     type: ACTIONS.SELECT_CLASS,
  //     className: CLASS_NAME,
  //   });
  //   expect(eventFactory.createClassSelectedEvent).toHaveBeenCalledWith({
  //     characterId: CHARACTER_ID,
  //     className: CLASS_NAME,
  //     version: VERSION,
  //   });
  //   expect(eventStoreService.appendEvent).toHaveBeenCalledWith(expectedEvent);
  //   expect(result).toEqual({
  //     characterId: CHARACTER_ID,
  //     className: CLASS_NAME,
  //   });
  // });
});
