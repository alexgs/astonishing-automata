/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { INestApplication, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';

import { EVENT_TYPES } from '../src/character-builder/constants';
import { EventStoreModule } from '../src/event-store/event-store.module';
import { EventStoreReadModel } from '../src/event-store/interfaces';
import { TOKENS } from '../src/provider-tokens';
import { ActorFactory } from '../src/state-machine/actor.factory';
import { STEPS } from '../src/state-machine/constants';
import { StateMachineModule } from '../src/state-machine/state-machine.module';
import { testLog } from '../src/winston-transports';

import { MockKnexService } from './mock-knex-service';
import { mockPostgresService } from './mock-postgres-service';

const CHARACTER_ID = '3dd8d324-ff14-4210-97e3-07e6cf4d729b';

const PAST_EVENTS: EventStoreReadModel[] = [
  {
    id: '01JPG3G7Z11P38SHXWSQJNNRZ0',
    stream_id: CHARACTER_ID,
    type: EVENT_TYPES.STEP_CHANGED,
    data: {
      characterId: CHARACTER_ID,
      nextStep: STEPS.SELECT_SPECIES,
    },
    created_at: new Date(1742149787617),
    version: 1,
  },
  {
    id: '01JPG3G90WJDGV7BFN727Z7NT7',
    stream_id: CHARACTER_ID,
    type: EVENT_TYPES.SPECIES_SELECTED,
    data: {
      characterId: CHARACTER_ID,
      species: 'elf',
    },
    created_at: new Date(1742149788700),
    version: 2,
  },
  {
    id: '01JPG3G9TSMXYDYY055M4TR7J1',
    stream_id: CHARACTER_ID,
    type: EVENT_TYPES.STEP_CHANGED,
    data: {
      characterId: CHARACTER_ID,
      previousStep: STEPS.SELECT_SPECIES,
      nextStep: STEPS.SELECT_CLASS,
    },
    created_at: new Date(1742149789529),
    version: 3,
  },
];

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
      it('creates an actor', async () => {
        const tracker = mockKnexService.getTracker();
        tracker.on.select('events').responseOnce(PAST_EVENTS);

        const { actor } = await actorFactory.getActor(CHARACTER_ID);
        expect(actor).toBeDefined();
        expect(actor.getSnapshot().value).toEqual(STEPS.SELECT_CLASS);
        expect(actor.getSnapshot().context.species).toEqual('elf');
      });
    });
  });
});
