/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { INITIAL_STEP, STEPS } from '@automata/state-machine';
import { clerkMiddleware } from '@clerk/express';
import { HttpStatus, INestApplication, VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import cookieParser from 'cookie-parser';
import { knex } from 'knex';
import { WinstonModule } from 'nest-winston';

import { AppModule } from '../src/app.module';
import { EVENT_TYPES as CHARACTER_EVENT_TYPES } from '../src/character-builder/constants';
import { testLog } from '../src/winston-transports';

import { KnexClient, getTestToken, resetDb } from './helpers';
import { ABED_USER_ID } from './helpers/constants';

describe('Character Builder Integration Test Suite 1', () => {
  const CHARACTER_ID = '53239dc3-1dfd-464c-9469-5cfcfb30be86';
  let app: INestApplication;
  let jwt: string;
  let knex: knex.Knex;
  let module: TestingModule;

  beforeAll(async () => {
    jwt = await getTestToken(ABED_USER_ID);

    jest.spyOn(crypto, 'randomUUID').mockReturnValue(CHARACTER_ID);

    knex = KnexClient.getKnex();
    await resetDb(knex);

    module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication({
      cors: true,
      logger: WinstonModule.createLogger({
        transports: [testLog],
      }),
    });

    // Access the raw Express app & register Clerk middleware
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use(clerkMiddleware());

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
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          method: 'POST',
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        response = error.response;
      } else {
        throw error;
      }
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
        userId: 'user_2ujCkIR038dvS1iYM8g3q3q1VNG',
      }),
      version: 1,
    });
  });

  it('Abed sets a value for the "Strength" attribute', async () => {
    let response: AxiosResponse;
    try {
      response = await axios(
        `http://localhost:3000/api/v1/character-builder/patch-character`,
        {
          data: {
            characterId: CHARACTER_ID,
            data: {
              attributes: {
                strength: 10,
              },
            },
          },
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          method: 'POST',
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        response = error.response;
      } else {
        throw error;
      }
    }

    expect(response.status).toEqual(HttpStatus.OK);

    const events = await knex('events')
      .where({ stream_id: CHARACTER_ID })
      .orderBy('id', 'asc');
    expect(events).toHaveLength(2);
    expect(events[1]).toMatchObject({
      type: CHARACTER_EVENT_TYPES.PATCHED,
      stream_id: CHARACTER_ID,
      data: expect.objectContaining({
        characterId: CHARACTER_ID,
        data: {
          attributes: {
            strength: 10,
          },
        },
        isValid: false,
      }),
      version: 2,
    });
  });

  it.skip('Abed tries to select an invalid species', async () => {
    let response: AxiosResponse;
    try {
      response = await axios(
        `http://localhost:3000/api/v1/character-builder/select-species`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          method: 'POST',
          data: {
            characterId: CHARACTER_ID,
            species: 'core.dragon',
          },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        response = error.response;
      } else {
        throw error;
      }
    }
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
  });

  it.skip('Abed selects a valid species', async () => {
    let response: AxiosResponse;
    try {
      response = await axios(
        `http://localhost:3000/api/v1/character-builder/select-species`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          method: 'POST',
          data: {
            characterId: CHARACTER_ID,
            species: 'core.elf',
          },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        response = error.response;
      } else {
        throw error;
      }
    }
    expect(response.status).toEqual(HttpStatus.CREATED);

    const events = await knex('events')
      .where({ stream_id: CHARACTER_ID })
      .orderBy('id', 'asc');
    expect(events).toHaveLength(2);
    expect(events.at(-1)).toMatchObject({
      type: 'CHARACTER_EVENT_TYPES.SPECIES_SELECTED',
      stream_id: CHARACTER_ID,
      data: expect.objectContaining({
        characterId: CHARACTER_ID,
        species: 'core.elf',
      }),
      version: 2,
    });
  });

  it.skip('Abed moves forward in the character creation workflow', async () => {
    let response: AxiosResponse;
    try {
      response = await axios(
        `http://localhost:3000/api/v1/character-builder/change-step`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          method: 'POST',
          data: {
            characterId: CHARACTER_ID,
            targetStep: STEPS.SELECT_CLASS,
          },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        response = error.response;
      } else {
        throw error;
      }
    }
    expect(response.status).toEqual(HttpStatus.CREATED);

    const events = await knex('events')
      .where({ stream_id: CHARACTER_ID })
      .orderBy('id', 'asc');
    expect(events).toHaveLength(3);
    expect(events.at(-1)).toMatchObject({
      type: 'CHARACTER_EVENT_TYPES.STEP_CHANGED',
      stream_id: CHARACTER_ID,
      data: expect.objectContaining({
        characterId: CHARACTER_ID,
        previousStep: STEPS.SELECT_SPECIES,
        nextStep: STEPS.SELECT_CLASS,
      }),
      version: 3,
    });
  });

  it.skip('Abed tries to make an invalid transition', async () => {
    let response: AxiosResponse;
    try {
      response = await axios(
        `http://localhost:3000/api/v1/character-builder/change-step`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          method: 'POST',
          data: {
            characterId: CHARACTER_ID,
            targetStep: STEPS.EQUIPMENT_GOLD_BUY,
          },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        response = error.response;
      } else {
        throw error;
      }
    }
    expect(response.status).toEqual(HttpStatus.CONFLICT);

    const events = await knex('events')
      .where({ stream_id: CHARACTER_ID })
      .orderBy('id', 'asc');
    expect(events).toHaveLength(3);
    expect(events.at(-1)).toMatchObject({
      type: 'CHARACTER_EVENT_TYPES.STEP_CHANGED',
      stream_id: CHARACTER_ID,
      data: expect.objectContaining({
        characterId: CHARACTER_ID,
        previousStep: STEPS.SELECT_SPECIES,
        nextStep: STEPS.SELECT_CLASS,
      }),
      version: 3,
    });
  });

  it.skip('Abed tries to select an invalid class', async () => {
    let response: AxiosResponse;
    try {
      response = await axios(
        `http://localhost:3000/api/v1/character-builder/select-class`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          method: 'POST',
          data: {
            characterId: CHARACTER_ID,
            className: 'homebrew.batman',
          },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        response = error.response;
      } else {
        throw error;
      }
    }
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);

    const events = await knex('events')
      .where({ stream_id: CHARACTER_ID })
      .orderBy('id', 'asc');
    expect(events).toHaveLength(3);
    expect(events.at(-1)).toMatchObject({
      type: 'CHARACTER_EVENT_TYPES.STEP_CHANGED',
      stream_id: CHARACTER_ID,
      data: expect.objectContaining({
        characterId: CHARACTER_ID,
        previousStep: STEPS.SELECT_SPECIES,
        nextStep: STEPS.SELECT_CLASS,
      }),
      version: 3,
    });
  });

  it.skip('Abed selects valid a class', async () => {
    let response: AxiosResponse;
    try {
      response = await axios(
        `http://localhost:3000/api/v1/character-builder/select-class`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          method: 'POST',
          data: {
            characterId: CHARACTER_ID,
            className: 'core.fighter',
          },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        response = error.response;
      } else {
        throw error;
      }
    }
    expect(response.status).toEqual(HttpStatus.CREATED);

    const events = await knex('events')
      .where({ stream_id: CHARACTER_ID })
      .orderBy('id', 'asc');
    expect(events).toHaveLength(4);
    expect(events.at(-1)).toMatchObject({
      type: 'CHARACTER_EVENT_TYPES.CLASS_SELECTED',
      stream_id: CHARACTER_ID,
      data: expect.objectContaining({
        characterId: CHARACTER_ID,
        className: 'core.fighter',
      }),
      version: 4,
    });
  });
});
