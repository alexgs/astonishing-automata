/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import * as request from 'supertest';

import { CharacterBuilderModule } from '../src/character-builder/character-builder.module';
import { EVENT_TYPES, STREAM_TYPES } from '../src/character-builder/constants';
import {
  CharacterStartedEvent,
  CharacterStartedEventPayload,
} from '../src/character-builder/events/character-started.event';
import {
  ClassSelectedEvent,
  ClassSelectedEventPayload,
} from '../src/character-builder/events/class-selected.event';
import { SpeciesSelectedEvent } from '../src/character-builder/events/species-selected.event';
import {
  StepChangedEvent,
  StepChangedEventPayload,
} from '../src/character-builder/events/step-changed.event';
import { StreamRecord } from '../src/event-store/interfaces';
import { TOKENS } from '../src/provider-tokens';
import { INITIAL_STEP, STEPS } from '../src/state-machine/constants';
import { testLog } from '../src/winston-transports';

import { MockKnexService } from './mock-knex-service';
import { mockPostgresService } from './mock-postgres-service';

const UUID = 'a95c950e-1305-476b-af8a-e7e0cc4e7dc5';

function getEventStream(streamRecord: StreamRecord) {
  // Start
  const startedEventPayload: CharacterStartedEventPayload = {
    characterId: UUID,
    nextStep: INITIAL_STEP,
  };
  const startedEvent: CharacterStartedEvent = {
    id: 'abc',
    createdAt: new Date(),
    data: startedEventPayload,
    streamId: UUID,
    type: EVENT_TYPES.STARTED,
    version: 1,
  };

  // Select species
  const speciesSelectedEventPayload = {
    characterId: UUID,
    species: 'core.human',
  };
  const speciesSelectedEvent: SpeciesSelectedEvent = {
    id: 'def',
    createdAt: new Date(),
    data: speciesSelectedEventPayload,
    streamId: UUID,
    type: EVENT_TYPES.SPECIES_SELECTED,
    version: 2,
  };

  // Change step
  const stepChangedEventPayload1: StepChangedEventPayload = {
    characterId: UUID,
    nextStep: STEPS.SELECT_CLASS,
    previousStep: STEPS.SELECT_SPECIES,
  };
  const stepChangedEvent1: StepChangedEvent = {
    id: 'ghi',
    createdAt: new Date(),
    data: stepChangedEventPayload1,
    streamId: UUID,
    type: EVENT_TYPES.STEP_CHANGED,
    version: 3,
  };

  // Select class
  const classSelectedEventPayload: ClassSelectedEventPayload = {
    characterId: UUID,
    className: 'core.fighter',
  };
  const classSelectedEvent: ClassSelectedEvent = {
    id: 'jkl',
    createdAt: new Date(),
    data: classSelectedEventPayload,
    streamId: UUID,
    type: EVENT_TYPES.CLASS_SELECTED,
    version: 4,
  };

  // Change step
  const stepChangedEventPayload2: StepChangedEventPayload = {
    characterId: UUID,
    nextStep: STEPS.SELECT_CLASS,
    previousStep: STEPS.SELECT_CLASS_FEATURES,
  };
  const stepChangedEvent2: StepChangedEvent = {
    id: 'mno',
    createdAt: new Date(),
    data: stepChangedEventPayload2,
    streamId: UUID,
    type: EVENT_TYPES.STEP_CHANGED,
    version: 5,
  };

  const allEvents = [
    startedEvent,
    speciesSelectedEvent,
    stepChangedEvent1,
    classSelectedEvent,
    stepChangedEvent2,
  ];
  return allEvents.slice(0, streamRecord.version);
}

describe('Character Builder module', () => {
  let app: INestApplication;
  let mockKnexService: MockKnexService;

  beforeAll(async () => {
    jest.spyOn(crypto, 'randomUUID').mockReturnValue(UUID);

    const moduleRef = await Test.createTestingModule({
      imports: [
        CharacterBuilderModule,
        ConfigModule.forRoot({
          envFilePath: '../.env',
        }),
        CqrsModule.forRoot(),
      ],
      providers: [],
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

    mockKnexService = moduleRef.get(TOKENS.KNEX_SERVICE);
  });

  afterAll(async () => {
    await app.close();
  });

  it('is defined', () => {
    expect(app.get(CharacterBuilderModule)).toBeDefined();
  });

  describe('Endpoints', () => {
    it('POST /character-builder/start', async () => {
      // Initial stream record
      const streamRecord: StreamRecord = {
        id: UUID,
        type: STREAM_TYPES.CHARACTER,
        version: 0,
      };

      const tracker = mockKnexService.getTracker();
      tracker.on.insert('streams').responseOnce(1);
      tracker.on.select('streams').responseOnce([streamRecord]);
      tracker.on.insert('events').responseOnce(1);
      tracker.on.update('streams').responseOnce(1);

      const response = await request(app.getHttpServer()).post(
        '/character-builder/start',
      );
      expect(response.status).toEqual(HttpStatus.CREATED);
      expect(response.body).toEqual({
        data: { characterId: UUID },
      });
    });

    it('POST /character-builder/select-species', async () => {
      const streamRecord: StreamRecord = {
        id: UUID,
        type: STREAM_TYPES.CHARACTER,
        version: 1,
      };

      const tracker = mockKnexService.getTracker();
      tracker.on.insert('streams').responseOnce(1);
      tracker.on.select('streams').responseOnce([streamRecord]);
      tracker.on.select('events').responseOnce(getEventStream(streamRecord));
      tracker.on.insert('events').responseOnce(1);
      tracker.on.update('streams').responseOnce(1);

      const response = await request(app.getHttpServer())
        .post('/character-builder/select-species')
        .send({
          characterId: UUID,
          species: 'core.human',
        });
      expect(response.status).toEqual(HttpStatus.CREATED);
      expect(response.body).toEqual({
        data: {
          characterId: UUID,
          species: 'core.human',
        },
      });
    });

    it('POST /character-builder/change-step', async () => {
      const streamRecord: StreamRecord = {
        id: UUID,
        type: STREAM_TYPES.CHARACTER,
        version: 2,
      };

      const tracker = mockKnexService.getTracker();
      tracker.on.insert('streams').responseOnce(1);
      tracker.on.select('streams').responseOnce([streamRecord]);
      tracker.on.select('events').responseOnce(getEventStream(streamRecord));
      tracker.on.insert('events').responseOnce(1);
      tracker.on.update('streams').responseOnce(1);

      const response = await request(app.getHttpServer())
        .post('/character-builder/change-step')
        .send({
          characterId: UUID,
          targetStep: STEPS.SELECT_CLASS,
        });
      expect(response.status).toEqual(HttpStatus.CREATED);
      expect(response.body).toEqual({
        data: {
          characterId: UUID,
          targetStep: STEPS.SELECT_CLASS,
        },
      });
    });

    it('POST /character-builder/select-class', async () => {
      const streamRecord: StreamRecord = {
        id: UUID,
        type: STREAM_TYPES.CHARACTER,
        version: 3,
      };

      const tracker = mockKnexService.getTracker();
      tracker.on.insert('streams').responseOnce(1);
      tracker.on.select('streams').responseOnce([streamRecord]);
      tracker.on.select('events').responseOnce(getEventStream(streamRecord));
      tracker.on.insert('events').responseOnce(1);
      tracker.on.update('streams').responseOnce(1);

      const response = await request(app.getHttpServer())
        .post('/character-builder/select-class')
        .send({
          characterId: UUID,
          className: 'core.fighter',
        });
      expect(response.status).toEqual(HttpStatus.CREATED);
      expect(response.body).toEqual({
        data: {
          characterId: UUID,
          className: 'core.fighter',
        },
      });
    });
  });

  describe('Event handlers', () => {
    describe('some-event-handler', () => {
      it.todo(`handles the "some-event" event by creating a projection`);
    });
  });
});
