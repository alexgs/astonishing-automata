/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { vi } from 'vitest';

import { evaluateCondition } from './evaluate-condition';
import * as testModule from './evaluate-test';
import * as getPathModule from './get-value-at-path';
import type { Constraint } from './types';

describe('Function `evaluateCondition`', () => {
  const getSpy = vi.spyOn(getPathModule, 'getValueAtPath');
  const testSpy = vi.spyOn(testModule, 'evaluateTest');

  afterEach(() => {
    vi.clearAllMocks();
  });

  const state = {
    attributes: {
      strength: 12,
      agility: 7,
    },
    class: 'Fighter',
  };

  it('evaluates condition with "this" using fieldValue', () => {
    const condition: Constraint['if'] = {
      this: { $gte: 10 },
    };

    testSpy.mockReturnValue(true);

    const result = evaluateCondition(condition, 12, state);

    expect(result).toBe(true);
    expect(getSpy).not.toHaveBeenCalled();
    expect(testSpy).toHaveBeenCalledWith({ $gte: 10 }, 12);
  });

  it('evaluates condition using getValueAtPath for non-"this" keys', () => {
    const condition: Constraint['if'] = {
      'attributes.strength': { $gte: 10 },
    };

    getSpy.mockReturnValue(12);
    testSpy.mockReturnValue(true);

    const result = evaluateCondition(condition, null, state);

    expect(result).toBe(true);
    expect(getSpy).toHaveBeenCalledWith(state, 'attributes.strength');
    expect(testSpy).toHaveBeenCalledWith({ $gte: 10 }, 12);
  });

  it('returns false if any condition fails (AND logic)', () => {
    const condition: Constraint['if'] = {
      this: { $gte: 10 },
      'attributes.agility': { $gte: 10 },
    };

    testSpy
      .mockImplementationOnce(() => true)   // this: 12 >= 10
      .mockImplementationOnce(() => false); // agility: 7 >= 10 → false

    getSpy.mockReturnValue(7);

    const result = evaluateCondition(condition, 12, state);
    expect(result).toBe(false);
  });

  it('returns true only if all conditions pass', () => {
    const condition: Constraint['if'] = {
      this: { $gte: 10 },
      'class': { $eq: 'Fighter' },
    };

    testSpy
      .mockImplementationOnce(() => true)   // this: 12 >= 10
      .mockImplementationOnce(() => true);  // class === 'Fighter'

    getSpy.mockReturnValue('Fighter');

    const result = evaluateCondition(condition, 12, state);
    expect(result).toBe(true);
  });

  it('handles nested state paths correctly', () => {
    const condition: Constraint['if'] = {
      'attributes.agility': { $eq: 7 },
    };

    getSpy.mockReturnValue(7);
    testSpy.mockReturnValue(true);

    const result = evaluateCondition(condition, null, state);

    expect(result).toBe(true);
    expect(getSpy).toHaveBeenCalledWith(state, 'attributes.agility');
    expect(testSpy).toHaveBeenCalledWith({ $eq: 7 }, 7);
  });

  it('returns false if evaluateTest returns false for any condition', () => {
    const condition: Constraint['if'] = {
      this: { $eq: 10 },
    };

    testSpy.mockReturnValue(false);

    const result = evaluateCondition(condition, 12, state);
    expect(result).toBe(false);
  });
});
