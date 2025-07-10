/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { get } from 'svelte/store';

import { auth } from '$lib/clerk';
import { config } from '$lib/config';
import { getCharacterState, getDirtyFields, resetCharacterState } from '$lib/stores/character-store';

export async function patchCharacter(characterId: string): Promise<void> {
  const current = getCharacterState();
  const dirty = getDirtyFields();

  if (dirty.size === 0) return;

  const payload = [...dirty].reduce((acc, key) => {
    acc[key] = current[key];
    return acc;
  }, {} as Record<string, unknown>);

  const session = get(auth.session);
  if (!session) {
    throw new Error('No active auth session found');
  }
  const token = await session.getToken();

  const res = await fetch(`https://${config.apiHost}/api/v1/character-builder/patch-character`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ characterId, data: payload }),
  });

  if (!res.ok) {
    throw new Error('Patch failed');
  }

  const result = await res.json();
  resetCharacterState(result.data.data);
}
