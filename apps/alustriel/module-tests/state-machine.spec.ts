/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { INestApplication, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';

import { EventStoreModule } from '../src/event-store/event-store.module';
import { TOKENS } from '../src/provider-tokens';
import { ActorFactory } from '../src/state-machine/actor.factory';
import { characterBuilderMachine } from '../src/state-machine/state-machine';
import { StateMachineModule } from '../src/state-machine/state-machine.module';
import { testLog } from '../src/winston-transports';

import { MockKnexService } from './mock-knex-service';
import { mockPostgresService } from './mock-postgres-service';

describe('State Machine module', () => {
  let actorFactory: ActorFactory;
  let app: INestApplication;

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('is defined', () => {
    expect(app.get(StateMachineModule)).toBeDefined();
  });
});
