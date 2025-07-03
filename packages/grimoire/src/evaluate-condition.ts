/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { evaluateTest } from './evaluate-test';
import { getValueAtPath } from './get-value-at-path';
import type { Constraint } from './types';

/**
 * @internal
 * Internal helper; use `evaluateField` for application-level constraint evaluation.
 *
 * @param condition - The condition clause of the constraint.
 * @param fieldValue - The value of the field being validated.
 * @param state - The full character state used for cross-field lookups.
 * @returns `true` if the condition passes; otherwise, `false`.
 */
export function evaluateCondition(
  condition: Constraint['if'],
  fieldValue: unknown,
  state: Record<string, unknown>,
): boolean {
  return Object.entries(condition).every(([ key, test ]) => {
    const value = key === 'this' ? fieldValue : getValueAtPath(state, key);
    return evaluateTest(test, value);
  });
}

