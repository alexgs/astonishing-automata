/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { HttpStatus, INestApplication, VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import * as cookieParser from 'cookie-parser';
import { Knex } from 'knex';

import { EVENT_TYPES as CHARACTER_EVENT_TYPES } from '../src/character-builder/constants';
import { AppModule } from '../src/app.module';
import { KnexClient, resetDb } from './helpers';

describe('Character Builder Integration Test Suite 1', () => {
  let app: INestApplication;
  let knex: Knex;
  let module: TestingModule;

  beforeAll(async () => {
    knex = KnexClient.getKnex();
    await resetDb(knex);

    module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    app.enableVersioning({ type: VersioningType.URI });
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    await app.listen(3000);
  });

  afterAll(async () => {
    await app.close();
    await module.close();
  });

  it('should move forward in the character creation workflow', async () => {
    const characterId = 'test-character-123';

    let response: AxiosResponse;
    try {
      response = await axios(
        `http://localhost:3000/api/v1/characters/move/${characterId}`,
        {
          method: 'POST',
          data: { event: 'NEXT' },
        },
      );
    } catch (e) {
      response = e.response;
    }

    expect(response.status).toEqual(HttpStatus.OK);

    const events = await knex('events').where({
      type: CHARACTER_EVENT_TYPES.STEP_CHANGED,
      stream_id: characterId,
    });
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      type: CHARACTER_EVENT_TYPES.STEP_CHANGED,
      stream_id: characterId,
      data: expect.objectContaining({ step: 'NEXT' }),
    });
  });

  it('should move backward in the character creation workflow', async () => {
    const characterId = 'test-character-123';

    let response: AxiosResponse;
    try {
      response = await axios(
        `http://localhost:3000/api/v1/characters/move/${characterId}`,
        {
          method: 'POST',
          data: { event: 'PREV' },
        },
      );
    } catch (e) {
      response = e.response;
    }

    expect(response.status).toEqual(HttpStatus.OK);

    const events = await knex('events').where({
      type: CHARACTER_EVENT_TYPES.STEP_CHANGED,
      stream_id: characterId,
    });
    expect(events).toHaveLength(2);
    expect(events[1]).toMatchObject({
      type: CHARACTER_EVENT_TYPES.STEP_CHANGED,
      stream_id: characterId,
      data: expect.objectContaining({ step: 'PREV' }),
    });
  });
});
