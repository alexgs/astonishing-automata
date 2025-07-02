/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { vi } from 'vitest';

import * as conditionModule from '../src/evaluate-condition';
import { type GameSystemDefinition, evaluateField } from '../src';

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

    const result = evaluateField('attributes.strength', baseState, system);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(result).toEqual([
      {
        path: 'attributes.strength',
        reason: 'Invalid value',
      }, {
        path: 'attributes.strength',
        reason: 'Invalid value',
      }, {
        path: 'attributes.strength',
        reason: 'Invalid value',
      },
    ]);
  });

  it('is allowed if all "allow" constraints match and no "block" constraints match', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 10 } }, then: { allowed: true } },
      { if: { this: { $eq: 20 } }, then: { allowed: false } },
      { if: { this: { $neq: 5 } }, then: { allowed: true } },
    ];

    const result = evaluateField('attributes.strength', baseState, system);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(result).toEqual([]);
  });

  it('returns false if both allow and disallow constraints match', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 10 } }, then: { allowed: true } },
      { if: { this: { $eq: 10 } }, then: { allowed: false, reason: 'Blocked' } },
    ];

    const result = evaluateField('attributes.strength', baseState, system);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(result).toEqual([{
      path: 'attributes.strength',
      reason: 'Blocked',
    }]);
  });

  it('returns false if an allow constraint exists but does not match', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 5 } }, then: { allowed: true } },
    ];

    const result = evaluateField('attributes.strength', baseState, system);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{
      path: 'attributes.strength',
      reason: 'Invalid value',
    }]);
  });

  it('returns true if an allow constraint matches and disallow constraint does not match', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 10 } }, then: { allowed: true } },
      { if: { this: { $eq: 5 } }, then: { allowed: false } },
    ];

    const result = evaluateField('attributes.strength', baseState, system);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(result).toEqual([]);
  });

  it('returns false if there are multiple disallow constraints and exactly one matches', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 10 } }, then: { allowed: false, reason: 'Too strong' } },
      { if: { this: { $eq: 5 } }, then: { allowed: false, reason: 'Too weak' } },
    ];

    const result = evaluateField('attributes.strength', baseState, system);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(result).toEqual([{
      path: 'attributes.strength',
      reason: 'Too strong',
    }]);
  });

  it('returns true if all constraints allow and match', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $gte: 5 } }, then: { allowed: true } },
      { if: { this: { $lte: 20 } }, then: { allowed: true } },
    ];

    const result = evaluateField('attributes.strength', baseState, system);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(result).toEqual([]);
  });

  it('returns false if all constraints allow but not all match', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $gte: 15 } }, then: { allowed: true } },
      { if: { this: { $lte: 20 } }, then: { allowed: true } },
    ];

    const result = evaluateField('attributes.strength', baseState, system);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(result).toEqual([
      {
        path: 'attributes.strength',
        reason: 'Invalid value',
      },
    ]);
  });

  it('handles conflicting constraints on the same path', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $lt: 10 } }, then: { allowed: true } },
      { if: { this: { $lte: 10 } }, then: { allowed: false } },
    ];

    const result = evaluateField('attributes.strength', baseState, system);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(result).toEqual([{
      path: 'attributes.strength',
      reason: 'Invalid value',
    }]);
  });

  it('returns false if both allow and disallow constraints exist but none match', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 5 } }, then: { allowed: true } },
      { if: { this: { $eq: 7 } }, then: { allowed: false } },
    ];

    const result = evaluateField('attributes.strength', baseState, system);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(result).toEqual([
      {
        path: 'attributes.strength',
        reason: 'Invalid value',
      }, {
        path: 'attributes.strength',
        reason: 'Invalid value',
      }
    ]);
  });

  it('returns true if only disallow constraints exists and none match', () => {
    const system: GameSystemDefinition = structuredClone(baseSystem);
    // @ts-expect-error -- `fields` is valid for group type but not single fields
    system.character.attributes.fields.strength.constraints = [
      { if: { this: { $eq: 5 } }, then: { allowed: false } },
      { if: { this: { $eq: 15 } }, then: { allowed: false } },
    ];

    const result = evaluateField('attributes.strength', baseState, system);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(result).toEqual([]);
  });
});
