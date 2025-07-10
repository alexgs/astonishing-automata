/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

// src/lib/stores/characterStore.ts
import set from 'lodash.set';
import { writable, get } from 'svelte/store';

type CharacterState = Record<string, unknown>;

export const characterState = writable<CharacterState>({});
export const dirtyFields = writable<Set<string>>(new Set());

export function updateField(key: string, value: unknown) {
  characterState.update(state => {
    const newState = structuredClone(state);
    set(newState, key, value);
    return newState;
  });
  dirtyFields.update(set => {
    const updated = new Set(set);
    updated.add(key);
    return updated;
  });
}

export function resetCharacterState(newState: CharacterState) {
  characterState.set(newState);
  dirtyFields.set(new Set());
}

export function getCharacterState(): CharacterState {
  return get(characterState);
}

export function getDirtyFields(): Set<string> {
  return get(dirtyFields);
}
