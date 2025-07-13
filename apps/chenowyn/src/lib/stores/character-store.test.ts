/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { beforeEach, describe, expect, test } from 'vitest';

import {
  updateField,
  resetCharacterState,
  getCharacterState,
  getDirtyFields
} from './character-store';

describe('character-store', () => {
  beforeEach(() => {
    // Ensure fresh state between tests
    resetCharacterState({});
  });

  test('updateField updates characterState with flat key', () => {
    updateField('name', 'Ash');

    const state = getCharacterState();
    expect(state).toEqual({ name: 'Ash' });

    const dirty = getDirtyFields();
    expect(dirty.has('name')).toBe(true);
  });

  test('updateField updates nested keys', () => {
    updateField('attributes.strength', 8);

    const state = getCharacterState();
    expect(state).toEqual({ attributes: { strength: 8 } });

    const dirty = getDirtyFields();
    expect(dirty.has('attributes.strength')).toBe(true);
  });

  test('resetCharacterState sets new state and clears dirtyFields', () => {
    updateField('name', 'Ash');
    updateField('attributes.smarts', 6);

    resetCharacterState({ name: 'Robin', attributes: { agility: 7 } });

    const state = getCharacterState();
    expect(state).toEqual({ name: 'Robin', attributes: { agility: 7 } });

    const dirty = getDirtyFields();
    expect(dirty.size).toBe(0);
  });

  test('getCharacterState and getDirtyFields reflect store state', () => {
    updateField('name', 'Quinn');

    expect(getCharacterState().name).toBe('Quinn');
    expect(getDirtyFields().has('name')).toBe(true);
  });
});
