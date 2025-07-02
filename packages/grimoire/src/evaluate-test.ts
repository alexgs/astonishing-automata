
/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import type { ConditionTest } from './types';

/**
 * @internal
 * Internal helper; use `evaluateField` for application-level constraint evaluation.
 *
 * @param test - An object containing a single operator and operand.
 * @param value - The value to compare against the operator.
 * @returns `true` if the value satisfies the test; otherwise, `false`.
 */
export function evaluateTest(test: ConditionTest, value: unknown): boolean {
  if ('$eq' in test) {
    return value === test.$eq;
  }

  if ('$neq' in test) {
    return value !== test.$neq;
  }

  if ('$lt' in test && typeof value === 'number') {
    return value < test.$lt!;
  }

  if ('$lte' in test && typeof value === 'number') {
    return value <= test.$lte!;
  }

  if ('$gt' in test && typeof value === 'number') {
    return value > test.$gt!;
  }

  if ('$gte' in test && typeof value === 'number') {
    return value >= test.$gte!;
  }

  if ('$in' in test && Array.isArray(test.$in)) {
    return test.$in.includes(value);
  }

  if ('$nin' in test && Array.isArray(test.$nin)) {
    return !test.$nin.includes(value);
  }

  if ('$count' in test && Array.isArray(value)) {
    return evaluateTest(test.$count, value.length);
  }

  return false;
}
