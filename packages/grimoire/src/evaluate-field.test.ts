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

  it('returns true if the field definition is missing', () => {
    const result = evaluateField('attributes.dexterity', baseState, baseSystem);
    expect(result).toEqual({
      result: true,
      violations: null,
    });
  });

  it('returns true if there are no constraints', () => {
    const result = evaluateField('attributes.strength', baseState, baseSystem);
    expect(result).toEqual({
      result: true,
      violations: null,
    });
  });

  it('returns true if all constraints block and none match', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 15 } }, then: { allowed: false } },
      { if: { this: { $eq: 5 } }, then: { allowed: false } },
      { if: { this: { $eq: -5 } }, then: { allowed: false } },
    ];

    spy.mockReturnValue(false);

    const result = evaluateField('attributes.strength', baseState, system);
    expect(result).toEqual({
      result: true,
      violations: null,
    });
  });

  it('returns false if one constraint blocks and matches', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $lte: 15 } }, then: { allowed: true } },
      { if: { this: { $eq: 10 } }, then: { allowed: false, reason: 'Strength must not equal 10' } },
      { if: { this: { $gte: 5 } }, then: { allowed: true } },
    ];

    spy.mockReturnValue(true);

    const result = evaluateField('attributes.strength', baseState, system);
    expect(result).toEqual({
      result: false,
      violations: [
        {
          path: 'attributes.strength',
          reason: 'Strength must not equal 10',
        },
      ],
    });
  });

  it('returns false if all constraints allow but none match', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 15 } }, then: { allowed: true } },
      { if: { this: { $eq: 5 } }, then: { allowed: true } },
      { if: { this: { $eq: -5 } }, then: { allowed: true } },
    ];

    spy.mockReturnValue(false);

    const result = evaluateField('attributes.strength', baseState, system);
    expect(result).toEqual({
      result: false,
      violations: [
        {
          path: 'attributes.strength',
          reason: 'Invalid value',
        },
        {
          path: 'attributes.strength',
          reason: 'Invalid value',
        },
        {
          path: 'attributes.strength',
          reason: 'Invalid value',
        },
      ],
    });
  });

  it('returns true if all "allow" constraints match and no "block" constraints match', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 10 } }, then: { allowed: true } },
      { if: { this: { $eq: 20 } }, then: { allowed: false } },
      { if: { this: { $neq: 5 } }, then: { allowed: true } },
    ];

    spy
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const result = evaluateField('attributes.strength', baseState, system);
    expect(result).toEqual({
      result: true,
      violations: null,
    });
  });
});
