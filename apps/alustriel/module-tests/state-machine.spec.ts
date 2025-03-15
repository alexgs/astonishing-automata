/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { INestApplication, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';

import { EVENT_TYPES } from '../src/character-builder/constants';
import { EventStoreModule } from '../src/event-store/event-store.module';
import { TOKENS } from '../src/provider-tokens';
import { ActorFactory } from '../src/state-machine/actor.factory';
import { STEPS } from '../src/state-machine/constants';
import { StateMachineModule } from '../src/state-machine/state-machine.module';
import { testLog } from '../src/winston-transports';

import { MockKnexService } from './mock-knex-service';
import { mockPostgresService } from './mock-postgres-service';

describe('State Machine module', () => {
  let actorFactory: ActorFactory;
  let app: INestApplication;
  let mockKnexService: MockKnexService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '../.env',
        }),
        CqrsModule.forRoot(),
        EventStoreModule,
        StateMachineModule,
      ],
      providers: [Logger],
    })
      .overrideProvider(TOKENS.POSTGRES_SERVICE)
      .useValue(mockPostgresService)
      .overrideProvider(TOKENS.KNEX_SERVICE)
      .useClass(MockKnexService)
      .compile();

    app = moduleRef.createNestApplication({
      logger: WinstonModule.createLogger({
        transports: [testLog],
      }),
    });
    await app.init();

    actorFactory = moduleRef.get<ActorFactory>(ActorFactory);
    mockKnexService = moduleRef.get(TOKENS.KNEX_SERVICE);
  });

  afterAll(async () => {
    await app.close();
  });

  it('is defined', () => {
    expect(app.get(StateMachineModule)).toBeDefined();
  });

  describe('Actor factory', () => {
    it('is defined', () => {
      expect(actorFactory).toBeDefined();
    });

    describe('when there are no events in the stream', () => {
      it('throws an error', async () => {
        const tracker = mockKnexService.getTracker();
        tracker.on.select('events').responseOnce([]);

        await expect(actorFactory.getActor('1')).rejects.toThrow(
          '[ActorFactory] No past events found! This should never happen!',
        );
      });
    });

    describe('when there are events in the stream', () => {
      // TODO Add more events and test the actor's data
      it('creates an actor', async () => {
        const characterId = 'fe92cd2c-9275-4b01-aef1-ab610ca5967d';
        const tracker = mockKnexService.getTracker();
        tracker.on.select('events').responseOnce([
          {
            id: '1',
            streamId: characterId,
            type: EVENT_TYPES.STEP_CHANGED,
            data: {
              characterId,
              previousStep: undefined,
              nextStep: STEPS.SELECT_SPECIES,
            },
            createdAt: new Date(),
          },
          {
            id: '2',
            streamId: characterId,
            type: EVENT_TYPES.STEP_CHANGED,
            data: {
              characterId,
              previousStep: STEPS.SELECT_SPECIES,
              nextStep: STEPS.SELECT_CLASS,
            },
            createdAt: new Date(),
          },
        ]);

        const { actor } = await actorFactory.getActor(characterId);
        expect(actor).toBeDefined();
        expect(actor.getSnapshot().value).toEqual(STEPS.SELECT_CLASS);
      });
    });
  });
});
