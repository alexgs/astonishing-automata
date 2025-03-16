/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import * as ulidModule from 'ulidx';

import { CreateEventWriteModelPayload } from '../interfaces';

import { createEventWriteModel } from './create-event-write-model';

describe('Pure function `createEventWriteModel`', () => {
  const mockUlid = '01HJ659NEF95QMJHSMGN36VA7J';

  beforeEach(() => {
    jest.spyOn(ulidModule, 'ulid').mockReturnValue(mockUlid);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when the expected version is 0', () => {
    const payload: CreateEventWriteModelPayload = {
      data: { title: 'Star Wars', year: '1977' },
      eventType: 'event-types.movie-created',
      streamId: 'ebe6d909-5976-4b64-8445-3b726ab891a4',
      streamType: 'movie',
      expectedVersion: 0,
    };

    it('returns the correct EventWriteModel with expected version 0', async () => {
      const result = await createEventWriteModel(payload);

      expect(result).toEqual({
        id: mockUlid,
        createdAt: expect.any(Date),
        data: payload.data,
        expectedVersion: 0,
        streamId: payload.streamId,
        streamType: payload.streamType,
        type: payload.eventType,
      });
    });
  });

  describe('when the expected version is not 0', () => {
    const payload: CreateEventWriteModelPayload = {
      data: { title: 'The Empire Strikes Back', year: '1980' },
      eventType: 'event-types.movie-updated',
      streamId: 'ebe6d909-5976-4b64-8445-3b726ab891a4',
      streamType: 'movie',
      expectedVersion: 5,
    };

    it('returns the correct EventWriteModel with the correct expected version', async () => {
      const result = await createEventWriteModel(payload);

      expect(result).toEqual({
        id: mockUlid,
        createdAt: expect.any(Date),
        data: payload.data,
        expectedVersion: 5,
        streamId: payload.streamId,
        streamType: payload.streamType,
        type: payload.eventType,
      });
    });
  });

  it('handles empty data object', async () => {
    const payload: CreateEventWriteModelPayload = {
      data: {},
      eventType: 'event-types.empty-event',
      streamId: 'ebe6d909-5976-4b64-8445-3b726ab891a4',
      streamType: 'empty',
      expectedVersion: 0,
    };

    const result = await createEventWriteModel(payload);
    expect(result.data).toEqual({});
  });

  it('preserves complex data structures in the payload', async () => {
    const complexData = {
      nested: { object: true },
      array: [1, 2, 3],
      null: null,
      mixed: { array: ['a', 'b'] },
    };

    const payload: CreateEventWriteModelPayload = {
      data: complexData,
      eventType: 'event-types.complex-event',
      streamId: 'ebe6d909-5976-4b64-8445-3b726ab891a4',
      streamType: 'complex',
      expectedVersion: 0,
    };

    const result = await createEventWriteModel(payload);
    expect(result.data).toEqual(complexData);
  });
});
