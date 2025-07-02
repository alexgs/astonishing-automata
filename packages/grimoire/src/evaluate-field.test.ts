/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { vi } from 'vitest';

import * as conditionModule from './evaluate-condition';
import { evaluateField } from './evaluate-field';
import type { GameSystemDefinition } from './types';

describe('Function `evaluateField`', () => {
  const spy = vi.spyOn(conditionModule, 'evaluateCondition');

  afterEach(() => {
    spy.mockReset();
  });

  const baseSystem: GameSystemDefinition = {
    id: 'demo',
    name: 'Demo System',
    steps: [],
    character: {
      attributes: {
        fields: {
          strength: {
            key: 'strength',
            type: 'number',
            constraints: [],
          },
        },
        type: 'group',
      },
    },
  };

  const baseState = {
    attributes: {
      strength: 10,
    },
  };

  it('returns an empty array if field definition is missing', () => {
    const result = evaluateField('attributes.dexterity', baseState, baseSystem);
    expect(result).toEqual([]);
  });

  it('returns an empty array if field has no constraints', () => {
    const result = evaluateField('attributes.strength', baseState, baseSystem);
    expect(result).toEqual([]);
  });

  it('returns an empty array if all constraints pass and allow the value', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 10 } }, then: { allowed: true } },
    ];

    spy.mockReturnValue(true);

    const result = evaluateField('attributes.strength', baseState, system);
    expect(result).toEqual([]);
  });

  it('returns a violation if a constraint passes and disallows the value', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 10 } }, then: { allowed: false, reason: 'Too strong' } },
    ];

    spy.mockReturnValue(true);

    const result = evaluateField('attributes.strength', baseState, system);
    expect(result).toEqual([{ path: 'attributes.strength', reason: 'Too strong' }]);
  });

  it('uses default message if disallowed constraint has no reason', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 10 } }, then: { allowed: false } },
    ];

    spy.mockReturnValue(true);

    const result = evaluateField('attributes.strength', baseState, system);
    expect(result).toEqual([{ path: 'attributes.strength', reason: 'Invalid value' }]);
  });

  it('ignores constraints that don’t pass', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 5 } }, then: { allowed: false, reason: 'Too weak' } },
    ];

    spy.mockReturnValue(false);

    const result = evaluateField('attributes.strength', baseState, system);
    expect(result).toEqual([]);
  });

  it('prefers first matching disallowed constraint even if later ones allow', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 10 } }, then: { allowed: false, reason: 'Nope' } },
      { if: { this: { $eq: 10 } }, then: { allowed: true } },
    ];

    spy.mockImplementation(() => true);

    const result = evaluateField('attributes.strength', baseState, system);
    expect(result).toEqual([{ path: 'attributes.strength', reason: 'Nope' }]);
  });

  it('short-circuits on an allowed=true constraint', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 10 } }, then: { allowed: true } },
      { if: { this: { $eq: 10 } }, then: { allowed: false, reason: 'Should not run' } },
    ];

    spy.mockReturnValue(true);

    const result = evaluateField('attributes.strength', baseState, system);
    expect(result).toEqual([]);
    expect(spy).toHaveBeenCalledTimes(1); // confirms short-circuit behavior
  });
});
