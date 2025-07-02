/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { vi } from 'vitest';

import * as conditionModule from './evaluate-condition';
import { evaluateField } from './evaluate-field';
import type { GameSystemDefinition } from './types';

// TODO Repeat this suite of tests with a mock for `evaluateCondition`
// TODO Add more tests to really stress the evaluation logic

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

  it('is allowed if the field definition is missing', () => {
    const result = evaluateField('attributes.dexterity', baseState, baseSystem);
    expect(result).toEqual([]);
  });

  it('is allowed if there are no constraints', () => {
    const result = evaluateField('attributes.strength', baseState, baseSystem);
    expect(spy).toHaveBeenCalledTimes(0);
    expect(result).toEqual([]);
  });

  it('is allowed if all constraints block and none match', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 15 } }, then: { allowed: false } },
      { if: { this: { $eq: 5 } }, then: { allowed: false } },
      { if: { this: { $eq: -5 } }, then: { allowed: false } },
    ];

    // spy.mockReturnValue(false);

    const result = evaluateField('attributes.strength', baseState, system);
    expect(result).toEqual([]);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('is rejected if one constraint blocks and matches', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 15 } }, then: { allowed: true } },
      { if: { this: { $eq: 10 } }, then: { allowed: false } },
      { if: { this: { $neq: 5 } }, then: { allowed: true } },
    ];

    // spy
    //   .mockReturnValueOnce(false)
    //   .mockReturnValueOnce(true)
    //   .mockReturnValueOnce(true);

    const result = evaluateField('attributes.strength', baseState, system);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(result).toEqual([{
      path: 'attributes.strength',
      reason: 'Invalid value',
    }]);
  });

  it('is rejected if all constraints allow but none match', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 15 } }, then: { allowed: true } },
      { if: { this: { $eq: 5 } }, then: { allowed: true } },
      { if: { this: { $eq: -5 } }, then: { allowed: true } },
    ];

    // spy.mockReturnValue(false);

    const result = evaluateField('attributes.strength', baseState, system);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(result).toEqual([{
      path: 'attributes.strength',
      reason: 'Invalid value',
    }]);
  });

  it('is allowed if all "allow" constraints match and no "block" constraints match', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 10 } }, then: { allowed: true } },
      { if: { this: { $eq: 20 } }, then: { allowed: false } },
      { if: { this: { $neq: 5 } }, then: { allowed: true } },
    ];

    // spy
    //   .mockReturnValueOnce(true)
    //   .mockReturnValueOnce(false)
    //   .mockReturnValueOnce(true);

    const result = evaluateField('attributes.strength', baseState, system);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(result).toEqual([]);
  });
});
