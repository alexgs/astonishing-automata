/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import * as request from 'supertest';

import { CharacterBuilderModule } from '../src/character-builder/character-builder.module';
import { StreamRecord } from '../src/event-store/interfaces';
import { TOKENS } from '../src/provider-tokens';
import { testLog } from '../src/winston-transports';

import { MockKnexService } from './mock-knex-service';
import { mockPostgresService } from './mock-postgres-service';

describe('Character Builder module', () => {
  const UUID = 'a95c950e-1305-476b-af8a-e7e0cc4e7dc5';
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
      const streamRecord: StreamRecord = {
        id: UUID,
        type: 'mock-event',
        version: 0,
      };

      const tracker = mockKnexService.getTracker();
      tracker.on.select('streams').responseOnce([]);
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
  });
});
