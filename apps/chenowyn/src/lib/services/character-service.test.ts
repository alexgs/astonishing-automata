/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { resetCharacterState } from '$lib/stores/character-store';

import { patchCharacter } from './character-service';

vi.mock('$lib/stores/character-store', () => ({
  getCharacterState: () => ({
    name: 'Ash',
      attributes: { strength: 6, agility: 5 }
  }),
  getDirtyFields: () => new Set(['name', 'attributes.strength']),
  resetCharacterState: vi.fn(),
}));

vi.mock('$lib/clerk', () => ({
  auth: {
    session: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      subscribe: (cb: Function) => {
        cb({
          getToken: vi.fn(() => Promise.resolve('test-token'))
        });
        return () => {};
      }
    }
  }
}));

vi.mock('$lib/config', () => ({
  config: { apiHost: 'example.test' }
}));

describe('patchCharacter', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('does nothing if dirtyFields is empty', async () => {
    const fetchMock = vi.fn(() =>
      new Promise((resolve) =>
        setTimeout(() =>
          resolve({
            ok: true,
            json: () => Promise.resolve({ data: { data: { updated: true } } }),
          }), 100)
      )
    );
    global.fetch = fetchMock as typeof global.fetch;

    const store = await import('$lib/stores/character-store');
    vi.spyOn(store, 'getDirtyFields').mockReturnValue(new Set<string>());
    vi.spyOn(store, 'getCharacterState').mockReturnValue({
      name: 'Ash',
      attributes: { strength: 6, agility: 5 }
    });

    await patchCharacter('abc123');

    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('throws error if no session is present', async () => {
    const clerk = await import('$lib/clerk');
    vi.spyOn(clerk.auth.session, 'subscribe').mockImplementation((cb) => {
      cb(null); // Simulate no session
      return () => {};
    });

    await expect(patchCharacter('abc123')).rejects.toThrow('No active auth session found');
  });

  test('sends correct PATCH request', async () => {
    const fetchMock = vi.fn(() =>
      new Promise((resolve) =>
        setTimeout(() =>
          resolve({
            ok: true,
            json: () => Promise.resolve({ data: { data: { updated: true } } }),
          }), 100)
      )
    );
    global.fetch = fetchMock as typeof global.fetch;

    await patchCharacter('abc123');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.test/api/v1/character-builder/patch-character',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
        body: JSON.stringify({
          characterId: 'abc123',
          data: {
            name: 'Ash',
            attributes: { strength: 6 }
          },
        }),
      })
    );

    expect(resetCharacterState).toHaveBeenCalledWith({ updated: true });
  });

  test('throws error on failed fetch', async () => {
    const fetchMock = vi.fn(() =>
      new Promise((resolve) =>
        setTimeout(() =>
          resolve({
            ok: false,
          }), 100)
      )
    );
    global.fetch = fetchMock as typeof global.fetch;

    await expect(patchCharacter('abc123')).rejects.toThrow('Patch failed');
  });
});
