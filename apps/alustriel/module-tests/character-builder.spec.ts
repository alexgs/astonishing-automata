/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { CharacterBuilderModule } from '../src/character-builder/character-builder.module';
import { TOKENS } from '../src/provider-tokens';

import { mockPostgresService } from './mock-postgres-service';

describe('Character Builder module', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        CharacterBuilderModule,
        ConfigModule.forRoot({
          envFilePath: '../../../.env',
        }),
        CqrsModule.forRoot(),
      ],
      providers: [],
    })
      .overrideProvider(TOKENS.POSTGRES_SERVICE)
      .useValue(mockPostgresService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('is defined', () => {
    expect(app.get(CharacterBuilderModule)).toBeDefined();
  });

  describe('Endpoints', () => {
    it('POST /character-builder/start', async () => {
      const response = await request(app.getHttpServer()).post(
        '/character-builder/start',
      );
      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.body).toEqual({
        data: { characterId: '01HJ659NEF95QMJHSMGN36VA7J' },
      });
    });
  });
});
