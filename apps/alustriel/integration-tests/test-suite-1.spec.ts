/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { HttpStatus, INestApplication, VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import * as cookieParser from 'cookie-parser';
import { knex } from 'knex';

import { AppModule } from '../src/app.module';
import { EVENT_TYPES as CHARACTER_EVENT_TYPES } from '../src/character-builder/constants';
import { STEPS } from '../src/state-machine/constants';

import { KnexClient, resetDb } from './helpers';

describe('Character Builder Integration Test Suite 1', () => {
  const CHARACTER_ID = '53239dc3-1dfd-464c-9469-5cfcfb30be86';
  let app: INestApplication;
  let knex: knex.Knex;
  let module: TestingModule;

  beforeAll(async () => {
    jest.spyOn(crypto, 'randomUUID').mockReturnValue(CHARACTER_ID);

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
    if (knex) {
      await knex.destroy();
    }
  });

  it('Abed starts the character builder process', async () => {
    let response: AxiosResponse;
    try {
      response = await axios(
        `http://localhost:3000/api/v1/character-builder/start`,
        {
          method: 'POST',
        },
      );
    } catch (e) {
      response = e.response;
    }

    expect(response.status).toEqual(HttpStatus.CREATED);
    const { characterId } = response.data.data;

    const events = await knex('events')
      .where({ stream_id: CHARACTER_ID })
      .orderBy('id', 'asc');
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      type: CHARACTER_EVENT_TYPES.STARTED,
      stream_id: characterId,
      data: expect.objectContaining({
        characterId: CHARACTER_ID,
        nextStep: STEPS.SELECT_SPECIES,
      }),
      version: 1,
    });
  });

  it('Abed selects a species', async () => {
    let response: AxiosResponse;
    try {
      response = await axios(
        `http://localhost:3000/api/v1/character-builder/select-species`,
        {
          method: 'POST',
          data: {
            characterId: CHARACTER_ID,
            species: 'elf',
          },
        },
      );
    } catch (e) {
      response = e.response;
    }
    expect(response.status).toEqual(HttpStatus.CREATED);

    const events = await knex('events')
      .where({ stream_id: CHARACTER_ID })
      .orderBy('id', 'asc');
    expect(events).toHaveLength(2);
    expect(events.at(-1)).toMatchObject({
      type: CHARACTER_EVENT_TYPES.SPECIES_SELECTED,
      stream_id: CHARACTER_ID,
      data: expect.objectContaining({
        characterId: CHARACTER_ID,
        species: 'elf',
      }),
      version: 2,
    });
  });

  it('Abed moves forward in the character creation workflow', async () => {
    let response: AxiosResponse;
    try {
      response = await axios(
        `http://localhost:3000/api/v1/character-builder/change-step`,
        {
          method: 'POST',
          data: {
            characterId: CHARACTER_ID,
            targetStep: STEPS.SELECT_CLASS,
          },
        },
      );
    } catch (e) {
      response = e.response;
    }
    expect(response.status).toEqual(HttpStatus.CREATED);

    const events = await knex('events')
      .where({ stream_id: CHARACTER_ID })
      .orderBy('id', 'asc');
    expect(events).toHaveLength(3);
    expect(events.at(-1)).toMatchObject({
      type: CHARACTER_EVENT_TYPES.STEP_CHANGED,
      stream_id: CHARACTER_ID,
      data: expect.objectContaining({
        characterId: CHARACTER_ID,
        previousStep: STEPS.SELECT_SPECIES,
        nextStep: STEPS.SELECT_CLASS,
      }),
      version: 3,
    });
  });

  it('Abed tries to make an invalid transition', async () => {
    let response: AxiosResponse;
    try {
      response = await axios(
        `http://localhost:3000/api/v1/character-builder/change-step`,
        {
          method: 'POST',
          data: {
            characterId: CHARACTER_ID,
            targetStep: STEPS.EQUIPMENT_GOLD_BUY,
          },
        },
      );
    } catch (e) {
      response = e.response;
    }
    expect(response.status).toEqual(HttpStatus.CONFLICT);

    const events = await knex('events')
      .where({ stream_id: CHARACTER_ID })
      .orderBy('id', 'asc');
    expect(events).toHaveLength(3);
    expect(events.at(-1)).toMatchObject({
      type: CHARACTER_EVENT_TYPES.STEP_CHANGED,
      stream_id: CHARACTER_ID,
      data: expect.objectContaining({
        characterId: CHARACTER_ID,
        previousStep: STEPS.SELECT_SPECIES,
        nextStep: STEPS.SELECT_CLASS,
      }),
      version: 3,
    });
  });
});
